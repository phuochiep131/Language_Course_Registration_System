const Study_T = require('../models/Study_time');

const add_study_time = async (req, res) => {

    const { day_of_week, study_time} = req.body;

    try {
        const newstudy_time = new Study_T({
            day_of_week,
            study_time
        });
        await newstudy_time.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    add_study_time
};