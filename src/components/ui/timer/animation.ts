export const cardAnimation = {
  open: {
    height: 160,
    width: 760,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  closed: {
    height: 160,
    width: 760,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const cardPanel = {
  closed: {
    height: 220,
    width: 764,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    height: "auto",
    width: 764,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const formAnimation = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      opacity: {
        duration: 0.1,
        ease: "easeOut",
      },
      height: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  },
  open: {
    opacity: 1,
    height: "320px",
    transition: {
      opacity: {
        delay: 0.6,
        duration: 0.5,
        ease: "easeOut",
      },
      height: {
        delay: 0.2,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  },
};

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
