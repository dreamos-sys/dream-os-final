export const LocalDb = {
  getSummary: () => {
    // Simulasi data dari Database Browser/APK
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    return {
      totalBooking: bookings.length || 12, // Default data simulasi
      k3Status: "NORMAL"
    };
  }
};
