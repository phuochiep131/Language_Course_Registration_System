const Language = require('../models/Language')
const Teacher = require('../models/Teacher')

const getLanguages = async (req, res) => {
    try {
        const languages = await Language.find()
        res.json(languages)
    } catch (err) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const addLanguage = async (req, res) => {
    const { language } = req.body
    try {
        const newLanguage = new Language({ language })
        await newLanguage.save()
        res.status(201).json({ message: 'Language added successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Failed to add language' })
    }
}

const deleteMultipleLanguages = async (req, res) => {
    const { languageIds } = req.body
    console.log(req.body)

    try {
        const teachersUsingLanguages = await Teacher.find({ language_id: { $in: languageIds } })

        if (teachersUsingLanguages.length > 0) {
            const usedLanguageIds = teachersUsingLanguages.map(teacher => teacher.language_id.toString())
            return res.status(400).json({
                message: 'Cannot delete. This language is currently in use by teachers.',
                usedLanguageIds,
            })
        }
        await Language.deleteMany({ _id: { $in: languageIds } })
        res.json({ message: 'Languages deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Delete failed' })
    }
}


const getLanguageById = async (req, res) => {
    console.log(req.params) // { id: '6626b58e...' }

    const id = req.params.id

    try {
        const lang = await Language.findById(id) // ID là string, mongoose tự chuyển thành ObjectId
        if (!lang) return res.status(404).json({ message: 'Not found' })
        res.json(lang)
    } catch (err) {
        console.error('Error fetching language:', err)
        res.status(500).json({ message: 'Error fetching language' })
    }
}

const updateLanguage = async (req, res) => {
    const { id } = req.params
    const { language } = req.body
    try {
        const updated = await Language.findByIdAndUpdate(id, { language }, { new: true })
        if (!updated) return res.status(404).json({ message: 'Not found' })
        res.json({ message: 'Update successful' })
    } catch (err) {
        res.status(500).json({ message: 'Update failed' })
    }
}

module.exports = {
    getLanguages,
    addLanguage,
    deleteMultipleLanguages,
    getLanguageById,
    updateLanguage
}