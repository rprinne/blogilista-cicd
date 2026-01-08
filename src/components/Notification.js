const Notification = ({ message, which }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={which}>
      {message}
    </div>
  );
};

export default Notification;