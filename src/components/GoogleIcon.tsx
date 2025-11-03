import { View, StyleSheet, Image } from 'react-native';

const GoogleLogo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/google_icon.png')} style={styles.imageView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  imageView: {
    width: 40,
    height: 40,
  }
});

export default GoogleLogo;

