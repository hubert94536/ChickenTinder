import React from 'react'
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import colors from '../../styles/colors.js'
import { connect } from 'react-redux'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import defImages from '../assets/images/defImages.js'
import ImageCard from '../cards/ImageCard.js'
import { ScrollView } from 'react-native-gesture-handler'
import { FlatList} from 'react-native'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

class EditProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameValue: this.props.name.name,
      usernameValue: this.props.username.username,
      validNameFormat: true,
      validUsernameFormat: true,
      disabled: false,
      images: [],
      selected: "",
      refresh: false,
    }
  }

  componentDidMount() {
    let pushImages= []
    for (var i = 0; i < defImages.length; i++) {
        pushImages.push(<ImageCard 
        image = {defImages[i]}
        press={(pic) => this.select(pic)}
        selected= {this.props.image.image === defImages[i]}/>)
        
    }

    
    this.setState({images: pushImages})
    this.setState({selected: this.props.image.image})

  }

   ItemView = ({item}) => {
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

  async updateSelected(pic) {
    let pushImages= []
    for (var i = 0; i < defImages.length; i++) {
        pushImages.push(<ImageCard 
        image = {defImages[i]}
        press={(selectedPic) => this.select(selectedPic)}
        selected= {pic === defImages[i]}/>)
        
    }
    this.setState({images: pushImages})
    console.log("Selected image:" + pic)

  }

  select(pic) {
    this.updateSelected(pic).then(() => {this.setState({selected: pic, refresh: !this.state.refresh})}) 
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
            <FlatList style={{ flexDirection: 'column' }} 
            data = {this.state.images}
            ItemSeparatorComponent={this.ItemSeparatorView}
            renderItem={this.ItemView}
            numColumns={4}
            extraData={this.state.selected}/>
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

const mapStateToProps = (state) => {
  const { error } = state
  const { name } = state
  const { username } = state
  const { image } = state
  return { error, name, username, image }
}

export default connect(mapStateToProps)(EditProfile)

EditProfile.propTypes = {
  dontSave: PropTypes.func,
  makeChanges: PropTypes.func,
  visible: PropTypes.bool,
  error: PropTypes.bool,
  image: PropTypes.object,
}

const styles = StyleSheet.create({
  mainContainerHeight: {
    height: height * 0.5,
    marginTop: '30%',
  },
  modalContent: {
    textAlign: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    height: height * 0.365,
    marginBottom: height * 0.01,
  },
  titleText: {
    fontSize: normalize(16.5),
  },
  nameText: {
    marginBottom: '2%',
    color: 'black',
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
    // margin: '1.5%',
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
})
