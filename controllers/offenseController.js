const Offense = require('../models/Offense');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email notification function
const sendEmailNotification = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
    };

    try {
        console.log("Sending email to:", email);
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

// Create offense
exports.createOffense = async (req, res) => {
    try {
        const offense = new Offense(req.body);
        await offense.save();

        // Send notification for offense creation
        await sendEmailNotification(
            offense.email,
            'New Offense Created',
            `A new offense has been recorded: ${offense.offenseDetails} with a fine of ${offense.fine}.`
        );

        res.status(201).json({
            message: 'Offense created successfully!',
            offense
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
        // res.status(500).json({ error: 'Failed to create offense' });

    }
};

// Get all offenses
exports.getAllOffenses = async (req, res) => {
    try {
        const offenses = await Offense.find();
        res.status(200).json(offenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch offenses' });
    }
};

// Update offense
exports.updateOffense = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOffense = await Offense.findByIdAndUpdate(id, req.body, { new: true });

        if (updatedOffense) {
            // Send notification for offense update
            await sendEmailNotification(
                updatedOffense.email,
                'Offense Updated',
                `Your offense has been updated: ${updatedOffense.offenseDetails} with a fine of ${updatedOffense.fine}.`
            );
        }

        res.status(200).json(updatedOffense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete offense
exports.deleteOffense = async (req, res) => {
    try {
        const { id } = req.params;
        const offense = await Offense.findById(id);

        if (offense) {
            // Send notification for offense deletion
            await sendEmailNotification(
                offense.email,
                'Offense Deleted',
                `Your offense for ${offense.offenseDetails} has been deleted.`
            );

            const result =  await offense.deleteOne({ _id: id });

            res.status(200).json({message: 'Offense has been deleted'});
        } else {
            res.status(404).json({ message: 'Offense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
