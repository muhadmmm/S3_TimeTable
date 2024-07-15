
  const timetable = {
    Monday: ["DCF", "DBMS", "DBMS", "DBMS/C (LAB)", "DBMS/C (LAB)", "DBMS/C (LAB)"],
    Tuesday: ["Prog-C", "CO", "CSH (LAB)", "CSH (LAB)", "CSH (LAB)", "CSH (LAB)"],
    Wednesday: ["WT/DCF (LAB)", "WT/DCF (LAB)", "WT/DCF (LAB)", "CO", "Prog-C", "Prog-C"],
    Thursday: ["WT LAB", "DBMS/C (LAB)", "DBMS/C (LAB)", "DBMS/C (LAB)", "CO", "CO"],
    Friday: ["WT/DCF (LAB)", "WT/DCF (LAB)", "WT/DCF (LAB)", "DCF", "DCF", "WT (LAB)"]
  };

  const scheduleNotification = (time, message) => {
    const now = new Date();
    const delay = time - now;
    if (delay > 0) {
      setTimeout(() => {
        new Notification("Timetable Alert", { body: message });
      }, delay);
    }
  };

  const notifyForToday = () => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: 'long' });
    const subjects = [...new Set(timetable[day])].join(" | ");
    new Notification("Today's Schedule", { body: subjects });
  };

  const requestNotificationPermission = () => {
    if (Notification.permission === "granted") {
      notifyForToday();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          notifyForToday();
        }
      });
    }
  };

  const setupDailyNotifications = () => {
    const now = new Date();
    now.setHours(8, 0, 0, 0); // Set to 8:00 AM
    if (now < new Date()) now.setDate(now.getDate() + 1);
    setTimeout(() => {
      notifyForToday();
      setInterval(notifyForToday, 24 * 60 * 60 * 1000); // Repeat every 24 hours
    }, now - new Date());
  };

  requestNotificationPermission();
  setupDailyNotifications();

  // Example: Schedule a notification for a specific period
  const periods = [
    { time: "09:15 AM", message: "First Period - DCF" },
    { time: "10:15 AM", message: "Second Period - DBMS" },
    { time: "11:30 AM", message: "Third Period - DBMS" },
    { time: "01:15 PM", message: "Fourth Period - DBMS/C (LAB)" },
    { time: "02:15 PM", message: "Fifth Period - DBMS/C (LAB)" },
    { time: "03:15 PM", message: "Sixth Period - DBMS/C (LAB)" },
  ];

  const today = new Date().toLocaleDateString("en-US", { weekday: 'long' });
  timetable[today].forEach((subject, index) => {
    const [time, modifier] = periods[index].time.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);
    scheduleNotification(notificationTime, periods[index].message);
  });
