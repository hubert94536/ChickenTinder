import React from 'react'
import { Dimensions, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import colors from '../../styles/colors.js'
import { assets as defImages } from '../assets/images/defImages.js'
import { FlatList} from 'react-native'
import ImageCard from '../cards/ImageCard.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import PropTypes from 'prop-types'
import screenStyles from '../../styles/screenStyles.js'
import { ScrollView } from 'react-native-gesture-handler'


const width = Dimensions.get('window').width

class ChoosePic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      selected: this.props.photo,
    }
  }

  componentDidMount() {
    let pushImages= []
    for (var i = 0; i < Object.keys(defImages).length; i++) {
      pushImages.push(
        <ImageCard
          image={defImages[Object.keys(defImages)[i]].toString()}
          press={(pic) => this.select(pic)}
          selected={this.state.selected === defImages[Object.keys(defImages)[i]].toString()}
        />,
      )
    }
    this.setState({ images: pushImages })
  }

   ItemView = ({item}) => {
    //  console.log(item.props.image)
    return (
      // FlatList Item
      item
    );
  };

   ItemSeparatorView = () => {
    return (
      // FlatList Item Separator
      <View
          style={{
              height: width*0.03,
              width: '100%',
          }}
      />
    );
  };

  select(pic) {
    let pushImages = []
    for (var i = 0; i < Object.keys(defImages).length; i++) {
      pushImages.push(
        <ImageCard
          image={defImages[Object.keys(defImages)[i]].toString()}
          press={(selectedPic) => this.select(selectedPic)}
          selected={pic === defImages[Object.keys(defImages)[i]].toString()}
        />,
      )
    }
    this.setState({ images: [] }, () => {
      this.setState({ images: pushImages, selected: pic })
    })
  }

  render() {
    return (
      <Modal animationType="fade" transparent visible={this.props.visible}>
        <View style={[modalStyles.mainContainer, styles.mainContainerHeight]}>
          <AntDesign
            name="closecircleo"
            style={[screenStyles.text, modalStyles.closeIcon]}
            onPress={() => this.props.dontSave()}
          />
          <View style={styles.modalContent}>
            
            <Text style={[screenStyles.text, styles.nameText]}>Select a Profile Icon</Text>
            <FlatList
              style={[styles.flatlist]}
              data={this.state.images}
              ItemSeparatorComponent={this.ItemSeparatorView}
              renderItem={this.ItemView}
              numColumns={4}
              keyExtractor={(item) => item.props.image}
              extraData={this.state.selected}
            />
          </View>
          <TouchableHighlight
            disabled={this.state.disabled}
            style={[screenStyles.medButton, styles.saveButton]}
            onPress={() => {
              this.props.makeChanges(this.state.selected)
            }}
            underlayColor="white"
          >
            
            <Text style={[screenStyles.smallButtonText, styles.saveText]}> Done</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    )
  }
}

export default ChoosePic

ChoosePic.propTypes = {
  dontSave: PropTypes.func,
  makeChanges: PropTypes.func,
  visible: PropTypes.bool,
  photo: PropTypes.string,
}

const styles = StyleSheet.create({
  mainContainerHeight: {
    height: width,
    marginTop: '30%',
  },
  modalContent: {
    textAlign: 'center',
    marginLeft: '9%',
    marginRight: '8%',
    height: width * 0.7,
    marginBottom: '5%',
  },
  titleText: {
    fontSize: normalize(16.5),
  },
  nameText: {
    marginBottom: '4%',
    color: colors.hex,
  },
  input: {
    color: '#7d7d7d',
    fontSize: normalize(15.5),
    borderBottomWidth: 1,
    borderColor: '#7d7d7d',
  },
  saveButton: {
    backgroundColor: screenStyles.hex.color,
    borderColor: screenStyles.hex.color,
    margin: '5%',
    width: '50%',
  },
  saveText: {
    padding: '10%',
    color: 'white',
  },
  warningText: {
    color: colors.hex,
    fontSize: normalize(12),
  },
  inputMargin: {
    marginBottom: '7%',
  },
  inputMarginWarning: {
    marginBottom: '1%',
  },
  flatlist: { 
    flexDirection: 'column' 
  }
})
