const UnReadMsg = (notification) => {
  return notification.filter((n) => n.isRead === false);
};

export default UnReadMsg;
