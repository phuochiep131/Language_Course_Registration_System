const Languagelevel = require('../models/Language_level'); // Import đúng model

const getAllLanguageslevel = async (req, res) => {
    try {
        const levels = await Languagelevel.find();
        res.json(levels);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addLanguagelevel = async (req, res) => {
    const { language_levelid, language_level  } = req.body;
    // console.log(language_level )
    try {
        const newLanguageLevel = new Languagelevel({ language_levelid, language_level });

        await newLanguageLevel.save();
        res.status(201).json({ message: 'Language level added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add language level' });
    }
};

const deleteMultipleLanguagelevel = async (req, res) => {
    const { languagelevelIds } = req.body;
    //console.log(languagelevelIds)
    try {
        await Languagelevel.deleteMany({ _id: { $in: languagelevelIds } });
        res.json({ message: 'Language levels deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed' });
    }
};

const getLanguageLevelById = async (req, res) => {
    const { id } = req.params;

    try {
        const lang = await Languagelevel.findById(id);
        if (!lang) return res.status(404).json({ message: 'Not found' });
        res.json(lang);
    } catch (err) {
        console.error('Error fetching language level:', err);
        res.status(500).json({ message: 'Error fetching language level' });
    }
};

const updateLanguageLevel = async (req, res) => {
    const { id } = req.params;
    const { language_level } = req.body;
    try {
        const updated = await Languagelevel.findByIdAndUpdate(id, { language_level }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Update successful' });
    } catch (err) {
        res.status(500).json({ message: 'Update failed' });
    }
};

module.exports = {
    getAllLanguageslevel,
    addLanguagelevel,
    deleteMultipleLanguagelevel,
    getLanguageLevelById,
    updateLanguageLevel
};
