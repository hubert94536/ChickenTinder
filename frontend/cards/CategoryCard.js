import React from 'react'
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'
import getCuisine from '../assets/images/foodImages.js'
import colors from '../../styles/colors.js'
import screenStyles from '../../styles/screenStyles.js'
import { TouchableOpacity } from 'react-native-gesture-handler'

const width = Dimensions.get('window').width

const bg = '#FCE5CD'

export default class CategoryCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: this.props.uid,
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
    let catList = [{ title: this.props.category }]
    const imgsrc = getCuisine(catList)
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
  uid: PropTypes.number,
  category: PropTypes.string,
  onPress: PropTypes.func,
}

const styles = StyleSheet.create({
  image: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  card: {
    width: width * 0.15,
    alignSelf: 'center',
    margin: '1.5%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 0 - 1,
    right: 0,
    fontSize: normalize(15),
  },
  textWrapper: {
    height: '15%',
  },
  text: {
    color: 'black',
    fontSize: normalize(12),
    textAlign: 'center',
  },
})
