import Category from '../models/category.js';
import Logger from '../utils/logger.js';

const logger = new Logger('category')

async function getCategory(req, res) {
    try {
        const categories = await Category.find()

        logger.info("Returning the list of categories");

        res.json({
            status: 'success',
            categories: categories,
            result: categories.length,
        })
    } catch (err) {

        logger.error(err);

        return res.status(500).json({ msg: err.message })
    }
}

async function createCategory(req, res) {
    try {

      const { name } = req.body;
      const newCategory = new Category({ name });
      
       const category = await Category.find({ name });
    
       if (category) {
         logger.error("Category already exist.");
    
         return res.status(400).json({ msg: "This category already exists." })
       }

       await newCategory.save()

        logger.info(`New category ${name} has been created`);

        res.json({ msg: "Created a new category" });
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ msg: err.message })
    }
}

async function deleteCategory(req, res) {
    try {å

        logger.info(`Deleted category ${req.params.id} has been deleted`);

        await Category.findByIdAndDelete(req.params.id)
        res.json({ msg: "Deleted a category" })
    } catch (err) {

        logger.error(err)

        return res.status(500).json({ msg: err.message })
    }
}

async function getCategoryByID(req, res) {
    try {
        const category = await Category.findOne({ _id: req.params.id })
        if (!category) return res.status(400).json({ msg: "This category does not exists." })

        logger.info(`Category ${req.params.id} found`);

        res.json({ 
          msg: "Category found",
          category
       })
    } catch (err) {

        logger.error(err)

        return res.status(500).json({ msg: err.message })
    }
}

async function updateCategory(req, res) {
  try {
      const { name } = req.body;

      const updatedCategory = await Category.findOneAndUpdate({ _id: req.params.id }, {
          name
      })

      logger.info(`Changing ${name} to ${updatedCategory}`);

      res.json({ msg: 'Updated a category' })
  } catch (err) {

      logger.error(err);

      return res.status(500).json({ msg: err.message });
  }
}

export {
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryByID,
 };
