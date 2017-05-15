import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

import Container from 'components/native/Container';
import s from 'style/sheets';
import Input from 'components/native/Input';
import Button from 'components/native/Button';
import * as actions from 'actions';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  onEmailChange(text) {
    console.log("email:" + text);
    this.setState({ email: text });
  }

  onPasswordChange(text) {
    this.setState({ password: text });
  }

  render() {
    return (
      <Container>
        <View
          style={{
            alignSelf: 'center',
            width: 240,
            margin: 12,
          }}
        >
          <Text style={[s.h1, s.textInverse, s.textCenter]}>
            Login
          </Text>
          <Input
            style={{ marginBottom: 8 }}
            placeholder="email"
            value={this.state.email}
            onChangeText={this.onEmailChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <Input
            style={{ marginBottom: 8 }}
            placeholder="password"
            value={this.state.password}
            onChangeText={this.onPasswordChange}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button onPress={() => this.props.submit(this.state)} type="inverse-primary">
            Go
          </Button>
        </View>
      </Container>
    );
  }
}

LoginForm.propTypes = {
  submit: React.PropTypes.func,
};

export default connect(
  () => ({}),
  dispatch => ({
    submit: data => dispatch(actions.login(data)),
  })
)(LoginForm);
