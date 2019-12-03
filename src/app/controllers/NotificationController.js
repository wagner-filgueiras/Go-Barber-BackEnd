import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    // check if the logged user is a provider
    const checkIProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true }, // field that will be updated
      { new: true } // will bring back the record updated
    );

    return res.json(notification);
  }
}
export default new NotificationController();
