import Depot from '../models/Depot.js';
// create Depot
export const createDepot = async (req, res) => {
  try {
    const { content, documentId, userId } = req.body;
    const depot = new Depot({ content, document: documentId, userId });
    await depot.save();
    res.status(201).json(depot);
  } catch (error) {
    res.status(500).json({ message: 'Error creating depot', error });
  }
};
// get Depots
export const getDepots = async (req, res) => {
  try {
    const depots = await Depot.find();
    res.status(200).json(depots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching depots', error });
  }
};
// get Depot By Id
export const getDepotById = async (req, res) => {
  try {
    const depot = await Depot.findById(req.params.depotId);
    res.status(200).json(depot);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching depot', error });
  }
};
// update Depot
export const updateDepot = async (req, res) => {
  try {
    const { content } = req.body;
    const depot = await Depot.findByIdAndUpdate(
      req.params.depotId,
      { content },
      { new: true }
    );
    res.status(200).json(depot);
  } catch (error) {
    res.status(500).json({ message: 'Error updating depot', error });
  }
};
// delete Depot
export const deleteDepot = async (req, res) => {
  try {
    await Depot.findByIdAndDelete(req.params.depotId);
    res.status(204).json({ message: 'Depot deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting depot', error });
  }
};
