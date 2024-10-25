export const indicatorsAnimation = {
  closed: {
    width: "90%",
    transition: {
      width: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  },
  open: {
    width: "100%",
    transition: {
      width: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  },
};
