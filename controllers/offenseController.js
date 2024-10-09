const Offense = require('../models/Offense');

exports.createOffense = async (req, res) => {
    try {
        const offense = new Offense(req.body);
        await offense.save();
        res.status(201).json(offense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getOffenses = async (req, res) => {
    try {
        const offenses = await Offense.find();
        res.status(200).json(offenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
