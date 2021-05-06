import React from 'react'
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TouchableOpacity } from 'react-native-gesture-handler'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import imgStyles from '../../styles/cardImage.js'
import getCuisine from '../assets/images/foodImages.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'

const width = Dimensions.get('window').width
const bg = '#FCE5CD'

const cuisine_imgs = {
  American: 'American (Traditional)',
  European: 'French',
  'Latin American': 'Spanish',
  Mediterranean: 'Mediterranean',
  'South Asian': 'Indian',
  'Southeast Asian': 'Vietnamese',
  'Pacific Islander': 'Polynesian',
  'East Asian': 'Chinese',
  'Middle Eastern': 'Middle Eastern',
  African: 'African',
}

export default class CategoryCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: false,
    }
  }

  onTap = () => {
    this.setState(
      (prevState) => ({
        selected: !prevState.selected,
      }),
      () => this.props.onPress(this.state.selected),
    )
  }

  render() {
    const imgsrc = getCuisine([cuisine_imgs[this.props.category]])
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={this.onTap}>
          <View
            style={[
              styles.imageWrapper,
              {
                borderRadius: 10,
                backgroundColor: bg,
                borderWidth: 2,
                borderColor: this.state.selected ? colors.hex : 'white',
              },
            ]}
          >
            <ImageBackground source={imgsrc} style={styles.image} />
            {this.state.selected && (
              <Icon style={[imgStyles.icon, styles.checkIcon]} name="check-circle" />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.textWrapper}>
          <Text style={[screenStyles.text, styles.text]}>{this.props.category}</Text>
        </View>
      </View>
    )
  }
}

CategoryCard.propTypes = {
  category: PropTypes.string,
  onPress: PropTypes.func,
}

const styles = StyleSheet.create({
  image: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    width: width * 0.15,
    height: width * 0.25,
    alignSelf: 'center',
    marginLeft: '1.5%',
    marginRight: '1.5%',
    marginTop: '2%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 0 - 2,
    right: 0,
    fontSize: normalize(15),
  },
  textWrapper: {
    height: '25%',
  },
  text: {
    color: 'black',
    fontSize: normalize(12),
    textAlign: 'center',
  },
})
