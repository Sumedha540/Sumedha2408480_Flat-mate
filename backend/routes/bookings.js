import express from 'express';

const router = express.Router();

// POST /api/bookings
router.post('/', async (req, res) => {
  try {

    const {
      propertyId,
      propertyTitle,
      ownerName,
      rent,
      paymentType,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      moveInDate
    } = req.body;

    // Validation
    if (
      !propertyId ||
      !propertyTitle ||
      !customerName ||
      !customerEmail
    ) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    // Example response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        propertyId,
        propertyTitle,
        ownerName,
        rent,
        paymentType,
        amount,
        customerName,
        customerEmail,
        customerPhone,
        moveInDate,
        status: 'confirmed'
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;