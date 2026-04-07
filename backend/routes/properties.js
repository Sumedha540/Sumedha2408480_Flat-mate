import express from 'express';
import Property from '../models/Property.js';

const router = express.Router();

// POST /api/properties - Create new property
router.post('/', async (req, res) => {
  try {
    const { title, location, latitude, longitude, rent, beds, baths, type, area, furnishing, parking, wifi, description, amenities, image, images, ownerName, ownerId, ownerEmail, ownerPhone, isPremium } = req.body;

    if (!title || !location || !rent || !type || !area || !ownerName || !ownerId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Ensure images array exists and has at least one image
    const propertyImages = images && images.length > 0 
      ? images 
      : (image ? [image] : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop']);

    const property = await Property.create({
      title,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      rent,
      beds: beds || 1,
      baths: baths || 1,
      type,
      area,
      furnishing: furnishing || 'Unfurnished',
      parking: parking || 'Not available',
      wifi: wifi || false,
      description: description || '',
      amenities: amenities || [],
      image: propertyImages[0], // First image as main image
      images: propertyImages,
      ownerName,
      ownerEmail: ownerEmail || '',
      ownerPhone: ownerPhone || '',
      ownerId,
      isPremium: isPremium || false,
      status: 'pending'
    });

    console.log('Property created with coordinates:', {
      id: property._id,
      title: property.title,
      latitude: property.latitude,
      longitude: property.longitude
    });

    res.status(201).json({ 
      success: true,
      message: 'Property submitted for review', 
      property: {
        id: property._id.toString(),
        _id: property._id.toString(),
        ...property.toObject()
      }
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/properties - Get properties (with filters)
router.get('/', async (req, res) => {
  try {
    const { status, ownerId, ownerName } = req.query;
    
    let query = {};
    
    // If no status specified, only show approved properties (for public)
    if (status) {
      query.status = status;
    } else if (!ownerId && !ownerName) {
      query.status = 'approved';
    }
    
    // Filter by owner
    if (ownerId) {
      query.ownerId = ownerId;
    }
    if (ownerName) {
      query.ownerName = ownerName;
    }
    
    const properties = await Property.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      properties: properties.map(p => ({
        id: p._id.toString(),
        _id: p._id.toString(),
        ...p.toObject()
      }))
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/properties/all - Get all properties (for admin)
router.get('/all', async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      properties: properties.map(p => ({
        id: p._id.toString(),
        _id: p._id.toString(),
        ...p.toObject()
      }))
    });
  } catch (error) {
    console.error('Error fetching all properties:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/properties/:id - Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({
      success: true,
      property: {
        id: property._id.toString(),
        _id: property._id.toString(),
        ...property.toObject()
      }
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// PUT /api/properties/:id - Update property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    console.log('Property updated:', updatedProperty._id);

    res.json({ 
      success: true,
      message: 'Property updated successfully', 
      property: {
        id: updatedProperty._id.toString(),
        _id: updatedProperty._id.toString(),
        ...updatedProperty.toObject()
      }
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// PUT /api/properties/:id/approve - Approve property
router.put('/:id/approve', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', rejectionReason: '' },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    console.log('Property approved:', property._id);

    res.json({ 
      success: true,
      message: 'Property approved successfully', 
      property: {
        id: property._id.toString(),
        _id: property._id.toString(),
        ...property.toObject()
      }
    });
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// PUT /api/properties/:id/reject - Reject property
router.put('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || 'Not specified' },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    console.log('Property rejected:', property._id);

    res.json({ 
      success: true,
      message: 'Property rejected', 
      property: {
        id: property._id.toString(),
        _id: property._id.toString(),
        ...property.toObject()
      }
    });
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// DELETE /api/properties/:id - Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const propertyTitle = property.title;
    const ownerName = property.ownerName;

    await Property.findByIdAndDelete(req.params.id);

    console.log('Property deleted:', req.params.id);

    res.json({ 
      success: true,
      message: 'Property deleted successfully',
      notification: {
        type: 'property_deleted',
        title: 'Property Deleted',
        message: `${ownerName} deleted property: "${propertyTitle}"`,
        propertyId: req.params.id
      }
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;
