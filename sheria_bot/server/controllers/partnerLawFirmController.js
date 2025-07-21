import PartnerLawFirm from '../models/PartnerLawFirm.js';

// Get all active law firms
export const getAllLawFirms = async (req, res) => {
  try {
    const { page = 1, limit = 20, location, specialization, sponsored_only } = req.query;

    const filters = {};
    if (location) filters.location = location;
    if (specialization) filters.specialization = specialization;
    if (sponsored_only === 'true') filters.sponsored_only = true;

    const lawFirms = await PartnerLawFirm.findActiveFirms(filters)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await PartnerLawFirm.countDocuments({
      is_active: true,
      verification_status: 'verified',
      payment_status: 'current',
      ...(location && { location }),
      ...(specialization && { specializations: specialization }),
      ...(sponsored_only === 'true' && { is_sponsored: true })
    });

    res.json({
      success: true,
      data: {
        law_firms: lawFirms,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_firms: total,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get law firms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving law firms'
    });
  }
};

// Get specific law firm by ID
export const getLawFirmById = async (req, res) => {
  try {
    const { id } = req.params;

    const lawFirm = await PartnerLawFirm.findById(id);

    if (!lawFirm || !lawFirm.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Law firm not found'
      });
    }

    res.json({
      success: true,
      data: { law_firm: lawFirm }
    });

  } catch (error) {
    console.error('Get law firm error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving law firm'
    });
  }
};

// Search law firms
export const searchLawFirms = async (req, res) => {
  try {
    const { q: query, location, specialization } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const filters = {};
    if (location) filters.location = location;
    if (specialization) filters.specialization = specialization;

    const lawFirms = await PartnerLawFirm.searchFirms(query.trim(), filters);

    res.json({
      success: true,
      data: {
        query,
        filters,
        law_firms: lawFirms,
        total_results: lawFirms.length
      }
    });

  } catch (error) {
    console.error('Search law firms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching law firms'
    });
  }
};

// Get law firms by location
export const getLawFirmsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const { specialization, sponsored_only } = req.query;

    const filters = { location };
    if (specialization) filters.specialization = specialization;
    if (sponsored_only === 'true') filters.sponsored_only = true;

    const lawFirms = await PartnerLawFirm.findActiveFirms(filters);

    res.json({
      success: true,
      data: {
        location,
        law_firms: lawFirms,
        total_firms: lawFirms.length
      }
    });

  } catch (error) {
    console.error('Get law firms by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving law firms by location'
    });
  }
};

// Get law firms by specialization
export const getLawFirmsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const { location, sponsored_only } = req.query;

    const filters = { specialization };
    if (location) filters.location = location;
    if (sponsored_only === 'true') filters.sponsored_only = true;

    const lawFirms = await PartnerLawFirm.findActiveFirms(filters);

    res.json({
      success: true,
      data: {
        specialization,
        law_firms: lawFirms,
        total_firms: lawFirms.length
      }
    });

  } catch (error) {
    console.error('Get law firms by specialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving law firms by specialization'
    });
  }
};

// Get sponsored law firms
export const getSponsoredLawFirms = async (req, res) => {
  try {
    const { location, specialization, tier } = req.query;

    const query = {
      is_active: true,
      verification_status: 'verified',
      payment_status: 'current',
      is_sponsored: true
    };

    if (location) query.location = location;
    if (specialization) query.specializations = specialization;
    if (tier) query.sponsorship_tier = tier;

    const lawFirms = await PartnerLawFirm.find(query)
      .sort({ 
        sponsorship_tier: 1, // featured first, then premium, then basic
        rating: -1,
        firm_name: 1 
      });

    res.json({
      success: true,
      data: {
        sponsored_firms: lawFirms,
        total_sponsored: lawFirms.length
      }
    });

  } catch (error) {
    console.error('Get sponsored law firms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving sponsored law firms'
    });
  }
};

// Increment law firm click count
export const incrementLawFirmClicks = async (req, res) => {
  try {
    const { id } = req.params;

    const lawFirm = await PartnerLawFirm.findById(id);

    if (!lawFirm || !lawFirm.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Law firm not found'
      });
    }

    await lawFirm.incrementClickCount();

    res.json({
      success: true,
      message: 'Click recorded',
      data: {
        click_count: lawFirm.click_count,
        monthly_clicks: lawFirm.monthly_clicks
      }
    });

  } catch (error) {
    console.error('Increment clicks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording click'
    });
  }
};

// Add testimonial to law firm
export const addLawFirmTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_name, testimonial_en, testimonial_sw, rating } = req.body;

    if (!client_name || !testimonial_en || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Client name, testimonial, and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const lawFirm = await PartnerLawFirm.findById(id);

    if (!lawFirm || !lawFirm.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Law firm not found'
      });
    }

    const testimonialData = {
      client_name,
      testimonial_en,
      testimonial_sw: testimonial_sw || testimonial_en,
      rating,
      verified: false // Will be verified manually
    };

    await lawFirm.addTestimonial(testimonialData);

    res.json({
      success: true,
      message: 'Testimonial added successfully. It will be reviewed before publication.',
      data: {
        average_rating: lawFirm.rating.average,
        total_reviews: lawFirm.rating.count
      }
    });

  } catch (error) {
    console.error('Add testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding testimonial'
    });
  }
};