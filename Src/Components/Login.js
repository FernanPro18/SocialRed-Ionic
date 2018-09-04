import React from 'react';
import { Container, Form, Item, Input, Label, Icon, Button, Text, Content } from 'native-base';
import Estilos from '../Css/Estilos';
import { LinearGradient } from 'expo';
import { Image, StatusBar } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import Alertas from 'react-native-increibles-alertas';
import { SimpleAnimation } from 'react-native-simple-animations';
import { Restablecer, LoginAuth, AuthLogin } from '../Controllers/UsuarioController';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        StatusBar.setHidden(true);
        this.state = {
            User: { Email: '', Password: '' }, Alert: {
                Mostrar: false, Spinner: false, Titulo: '', Mensaje: '', Tipo: '', Boton: () => { }
            }
        }
    }

    componentWillMount() {
        this.CambiarEstadoAlert(true, true, 'Cargando', 'Por favor espere un momento...', 'aprobado', () => { });
        AuthLogin(this.props.navigation).then(() => {
            this.props.navigation.push('Tabs');
        }).catch(() =>{
            this.CambiarEstadoAlert(false, false, '', '', '', () => { })
        })
    }

    Restaurar = async () => {
        if (this.state.User.Email.length <= 0) {
            this.CambiarEstadoAlert(true, false, 'Error', 'Debe usar el campo del email', 'error', () => { this.CambiarEstadoAlert(false, false, '', '', '', () => { }) })
        } else {
            this.CambiarEstadoAlert(true, true, 'Cargando', 'Por favor espere un momento...', 'aprobado', () => { });
            Restablecer(this.state.User.Email).then(() => {
                this.CambiarEstadoAlert(true, false, 'Correcto', 'Por favor revise su email', 'aprobado', () => { this.CambiarEstadoAlert(false, false, '', '', '', () => { }) });
            }).catch(err => {
                this.CambiarEstadoAlert(true, false, 'Error', err.message, 'error', () => { this.CambiarEstadoAlert(false, false, '', '', '', () => { }) });
            })
        }
    }

    Entrar = async () => {
        if (this.state.User.Email.length <= 0) {
            this.CambiarEstadoAlert(true, false, 'Error', 'Todos los campos son requeridos', 'error', () => { this.CambiarEstadoAlert(false, false, '', '', '', () => { }) })
        } else {
            this.CambiarEstadoAlert(true, true, 'Cargando', 'Por favor espere un momento...', 'aprobado', () => { });
            LoginAuth(this.state.User).then(() => {
                this.props.navigation.push('Tabs');
            }).catch(err => {
                this.CambiarEstadoAlert(true, false, 'Error', err.message, 'error', () => { this.CambiarEstadoAlert(false, false, '', '', '', () => { }) });
            })
        }
    }

    CambiarEstadoUser = (Email, Password) => {
        this.setState({ User: { Password: Password, Email: Email } });
    }

    CambiarEstadoAlert = (Mostrar, Spinner, Titulo, Mensaje, Tipo, Boton) => {
        this.setState({ Alert: { Mostrar: Mostrar, Spinner: Spinner, Titulo: Titulo, Mensaje: Mensaje, Tipo: Tipo, Boton: Boton } });
    }

    render() {
        return (
            <Container>
                <Alertas
                    Tipo={this.state.Alert.Tipo}
                    Titulo={this.state.Alert.Titulo}
                    Mensaje={this.state.Alert.Mensaje}
                    Spinner={this.state.Alert.Spinner}
                    Mostrar={this.state.Alert.Mostrar}
                    BotonCancelado={false}
                    TextoBotonCancelado='Cancelar'
                    TextoBotonConfirmado='Ok'
                    onBotonCancelado={() => { }}
                    onBotonConfirmado={this.state.Alert.Boton} />
                <LinearGradient colors={['#800080', '#000']} start={[0, 1]} end={[1, 0]} style={Estilos.Pantalla}>
                    <SimpleAnimation style={Estilos.Content} delay={100} duration={1000} staticType='zoom' movementType='spring' direction='left'>
                        <Content padder contentContainerStyle={Estilos.Content}>
                            <Grid>
                                <Row size={2} style={Estilos.CenterFlex}>
                                    <Image source={require('../../assets/icon.png')} style={Estilos.Imagen} resizeMode='contain' />
                                </Row>
                                <Row size={1} style={[Estilos.Start]}>
                                    <Form style={[Estilos.Content, Estilos.CenterFlex]}>
                                        <Item floatingLabel last>
                                            <Icon name='email' style={Estilos.Color} type='Entypo' />
                                            <Label style={Estilos.Color}>Email</Label>
                                            <Input style={Estilos.Color} keyboardType='email-address' onChangeText={text => this.CambiarEstadoUser(text, this.state.User.Password)} />
                                        </Item>
                                        <Item floatingLabel last>
                                            <Icon name='vpn-key' style={Estilos.Color} type='MaterialIcons' />
                                            <Label style={Estilos.Color}>Password</Label>
                                            <Input style={Estilos.Color} secureTextEntry onChangeText={text => this.CambiarEstadoUser(this.state.User.Email, text)} />
                                        </Item>
                                        <Button iconLeft transparent block onPress={this.Restaurar.bind(this)}>
                                            <Icon name='backup-restore' type='MaterialCommunityIcons' style={Estilos.Color} />
                                            <Text style={Estilos.Color}>Recuperar Contraseña</Text>
                                        </Button>
                                    </Form>
                                </Row>
                                <Row size={2} style={[Estilos.CenterFlex]}>
                                    <Col style={[Estilos.CenterFlex]}>
                                        <Button iconLeft style={Estilos.Boton} block onPress={this.Entrar.bind(this)}>
                                            <Icon name='login' type='Entypo' />
                                            <Text>Entrar</Text>
                                        </Button>
                                        <Button iconLeft transparent block onPress={() => this.props.navigation.push('Registrar')}>
                                            <Icon name='add-box' type='MaterialIcons' style={Estilos.Color} />
                                            <Text style={Estilos.Color}>Registrar</Text>
                                        </Button>
                                    </Col>
                                </Row>
                            </Grid>
                        </Content>
                    </SimpleAnimation>
                </LinearGradient>
            </Container>
        );
    }
}