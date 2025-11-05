import Message from '../model/message.js';

export const getMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({ groupId }).sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const createMessage = async (req, res) => {
  const { groupId, text, sender, replyTo } = req.body;

  if (!groupId || !text || !sender) {
    return res
      .status(400)
      .json({ success: false, message: 'groupId, text, and sender are required' });
  }

  try {
    const newMessage = await Message.create({ groupId, text, sender, replyTo });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
