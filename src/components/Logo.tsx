import { Image, StyleSheet, View } from 'react-native';

const Logo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/perdiem_logo.png')} style={styles.imageView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageView: {
    width: 85,
    height: 85,
    marginBottom: 8,
    resizeMode: 'contain',
  }
});

export default Logo;

