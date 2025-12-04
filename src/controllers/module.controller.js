import { ModuleService } from '../services/module.service.js';

export const 
createModule = async (req, res) => {
  try {
    const module = await ModuleService.createModule(req.body);
    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: module
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCourseModules = async (req, res) => {
  try {
    const modules = await ModuleService.getCourseModules(req.params.courseId);
    res.status(200).json({
      success: true,
      data: modules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getModuleById = async (req, res) => {
  try {
    const module = await ModuleService.getModuleById(req.params.id);
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateModule = async (req, res) => {
  try {
    const module = await ModuleService.updateModule(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      data: module
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteModule = async (req, res) => {
  try {
    await ModuleService.deleteModule(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};