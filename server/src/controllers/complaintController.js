const Complaint = require('../models/Complaint');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Student & Admin)
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location, priority, attachments } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      priority: priority || 'low',
      attachments: attachments || [],
      studentId: req.user.id,
    });

    const populatedComplaint = await Complaint.findById(complaint._id).populate(
      'studentId',
      'name email'
    );

    res.status(201).json(populatedComplaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints (Student: own complaints only | Admin: all complaints)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;

    const filter = {};

    // If student, restrict to own complaints
    if (req.user.role === 'student') {
      filter.studentId = req.user.id;
    }

    // Apply optional filter parameters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate('studentId', 'name email')
      .populate('adminComments.authorId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('adminComments.authorId', 'name email role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Students can only view their own complaint details
    if (
      req.user.role === 'student' &&
      complaint.studentId._id.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only view your own complaints' });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint (Admin: status, priority, assignment, comments, resolution)
// @route   PUT /api/complaints/:id
// @access  Private (Admin Only)
const updateComplaint = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      assignedDepartment,
      assignedStaff,
      comment,
      resolutionDetails,
    } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Apply updates if present
    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    if (assignedDepartment !== undefined) complaint.assignedDepartment = assignedDepartment;
    if (assignedStaff !== undefined) complaint.assignedStaff = assignedStaff;
    if (resolutionDetails !== undefined) complaint.resolutionDetails = resolutionDetails;

    // Append comment if present
    if (comment && comment.trim()) {
      complaint.adminComments.push({
        text: comment.trim(),
        authorId: req.user.id,
      });
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('studentId', 'name email')
      .populate('adminComments.authorId', 'name email role');

    res.json(updatedComplaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin Only)
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint successfully removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
const getAdminStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();

    // Group by status
    const statusStats = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Group by category
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Format status counts
    const byStatus = {
      submitted: 0,
      under_review: 0,
      assigned: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
    };
    statusStats.forEach((stat) => {
      if (stat._id in byStatus) {
        byStatus[stat._id] = stat.count;
      }
    });

    // Format category counts
    const byCategory = {
      classroom: 0,
      lab: 0,
      hostel: 0,
      wifi: 0,
      infrastructure: 0,
      transport: 0,
      cleanliness: 0,
      other: 0,
    };
    categoryStats.forEach((stat) => {
      if (stat._id in byCategory) {
        byCategory[stat._id] = stat.count;
      }
    });

    res.json({
      total,
      byStatus,
      byCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Suggest category from text description (AI suggested)
// @route   POST /api/complaints/suggest-category
// @access  Private
const suggestCategory = async (req, res, next) => {
  try {
    const { description } = req.body;
    if (!description || !description.trim()) {
      return res.json({ category: 'other' });
    }

    const text = description.toLowerCase();

    // 1. Check if Gemini API key exists
    if (process.env.GEMINI_API_KEY) {
      try {
        const https = require('https');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const payload = {
          contents: [
            {
              parts: [
                {
                  text: `Analyze this complaint description and classify it into exactly one of these categories: classroom, lab, hostel, wifi, infrastructure, transport, cleanliness, other. Return ONLY the category name in lowercase with no other words or formatting. Description: "${description}"`
                }
              ]
            }
          ]
        };

        const result = await new Promise((resolve, reject) => {
          const urlObj = new URL(url);
          const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          };

          const reqClient = https.request(options, (resClient) => {
            let body = '';
            resClient.on('data', (chunk) => (body += chunk));
            resClient.on('end', () => {
              try {
                resolve(JSON.parse(body));
              } catch (e) {
                reject(e);
              }
            });
          });

          reqClient.on('error', (err) => reject(err));
          reqClient.write(JSON.stringify(payload));
          reqClient.end();
        });

        const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toLowerCase();
        const validCategories = ['classroom', 'lab', 'hostel', 'wifi', 'infrastructure', 'transport', 'cleanliness', 'other'];

        if (reply && validCategories.includes(reply)) {
          return res.json({ category: reply });
        }
      } catch (geminiError) {
        console.error('[Gemini AI suggestion failed, falling back to keywords]:', geminiError.message);
      }
    }

    // 2. Fallback Keyword Classifier
    let category = 'other';
    if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet') || text.includes('router') || text.includes('network') || text.includes('slow speed')) {
      category = 'wifi';
    } else if (text.includes('projector') || text.includes('classroom') || text.includes('bench') || text.includes('board') || text.includes('desk') || text.includes('lecture')) {
      category = 'classroom';
    } else if (text.includes('lab') || text.includes('laboratory') || text.includes('pc') || text.includes('computer') || text.includes('software') || text.includes('instrument')) {
      category = 'lab';
    } else if (text.includes('hostel') || text.includes('room') || text.includes('dorm') || text.includes('mess') || text.includes('canteen') || text.includes('warden')) {
      category = 'hostel';
    } else if (text.includes('shuttle') || text.includes('bus') || text.includes('transport') || text.includes('driver') || text.includes('commute')) {
      category = 'transport';
    } else if (text.includes('toilet') || text.includes('washroom') || text.includes('cleanliness') || text.includes('dirty') || text.includes('sweep') || text.includes('dustbin') || text.includes('garbage') || text.includes('dust')) {
      category = 'cleanliness';
    } else if (text.includes('leak') || text.includes('pipe') || text.includes('roof') || text.includes('wall') || text.includes('door') || text.includes('window') || text.includes('fan') || text.includes('light') || text.includes('ac ') || text.includes('air conditioner')) {
      category = 'infrastructure';
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getAdminStats,
  suggestCategory,
};


