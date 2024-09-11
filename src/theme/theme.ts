const lightTheme = {
  button: {
    bgColor: 'white',
    color: 'black'
  }
};

const darkTheme = {
  button: {
    bgColor: 'black',
    color: 'white'
  }
};

export const selectTheme = () => {
  const params = new URLSearchParams(window.location.search);
  const platform = params.get('platform');

  switch (platform) {
    case 'android':
      return darkTheme;
    default:
      return lightTheme;
  }
};
