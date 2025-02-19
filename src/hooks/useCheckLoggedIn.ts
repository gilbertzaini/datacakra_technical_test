const useCheckLoggedIn = (): boolean => {
  try {
    const token = localStorage.getItem("jwt");

    return !!token;
  } catch (error) {
    console.error("Error parsing JWT_Token:", error);
    return false;
  }
};

export default useCheckLoggedIn;
