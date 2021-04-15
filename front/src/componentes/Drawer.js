import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import { UserProfile } from "./UserProfile"
import { TaskFilter } from "./TaskFilter"
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import CheckIcon from '@material-ui/icons/Check';
import Modal from '@material-ui/core/Modal';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { Cards } from './Cards';
import axios from 'axios';

const ProfileView = () => (
    <UserProfile />
);

export class DrawerLogin extends React.Component {
    constructor(props) {
        super(props)
        this.getTodoData()
        this.state = {
            left: false, open: false, description: '', responsable: '',
            state: '', dueDate: '', user: [], file: null, urlFile: ''
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleDescription = this.handleDescription.bind(this)
        this.handleResponsable = this.handleResponsable.bind(this)
        this.handleState = this.handleState.bind(this)
        this.handleDueDate = this.handleDueDate.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleOpenEdit = this.handleOpenEdit.bind(this)
        this.handleCloseEdit = this.handleCloseEdit.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(e) {
        this.setState({
            file: e.target.files[0]
        });
    }

    handleCloseEdit() {
        this.setState({
            edit: false
        })
    }

    handleOpenEdit() {
        this.setState({
            edit: true
        })
    }

    postImage = () => {
        let data = new FormData();
        data.append('file', this.state.file);

        axios.post('http://localhost:8080/api/files', data)
            .then(response => {
                console.log("file uploaded!", response.data);
                this.setState({
                    urlFile: response.data
                });
                this.postTodoData();
            })
            .catch(error => {
                console.log("failed file upload", error);
                return error
            });
    }

    postTodoData = async () => {
        const newItem = {
            description: this.state.description,
            priority: 5,
            dueDate: this.state.dueDate,
            responsible: {
                name: this.state.responsable,
                email: "juan@gmail.com"
            },
            status: this.state.state,
            fileUrl: this.state.urlFile
        }

        await axios.post('http://localhost:8080/api/todo', newItem)
            .then(response => {
                console.log("file uploaded!", response);
                console.log(response);
                this.getTodoData()
            })
            .catch(error => {
                console.log("failed file upload", error);
            });
    }

    getTodoData = async () => {
        await axios.get('http://localhost:8080/api/todo')
            .then(response => {
                console.log("files returned!", response);
                console.log(response);
                this.setState({
                    user: response.data
                })
            })
            .catch(error => {
                console.log("failed file geted", error);
            });
    }

    handleSave() {
        this.postImage();
        this.handleClose()
    }

    handleDescription(data) {
        this.setState({
            description: data.target.value
        })
    }

    handleResponsable(data) {
        this.setState({
            responsable: data.target.value
        })
    }

    handleState(data) {
        this.setState({
            state: data.target.value
        })
    }

    handleDueDate(data) {
        this.setState({
            dueDate: data.target.value
        })
    }

    handleOpen() {
        this.setState({
            open: true
        })
    }

    handleClose() {
        this.setState({
            open: false
        })
    }

    render() {
        
        const toggleDrawer = (open) => (event) => {
            if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                return;
            }

            if (open === false) {
                this.setState({
                    left: false
                })
            } else {
                this.setState({
                    left: true
                })
            }

        };

        const list = (
            <div
                role="presentation"
                onKeyDown={toggleDrawer(false)}
                style={{ position: 'relative', width: '50vh' }}
            >
                <List>
                    <ListItem button>
                        <Avatar>
                            <AccountCircleIcon />
                        </Avatar>
                        <div>
                            <ListItemText primary={localStorage.getItem("name")} />
                            <ListItemText primary={localStorage.getItem("mail")} />
                        </div><br />
                    </ListItem>
                    <div style={{ marginLeft: '40vh' }}>
                        <Button onClick={this.handleOpenEdit}>
                            <Avatar>
                                <EditIcon />
                            </Avatar>
                        </Button>
                    </div>
                </List>
                <Divider />
                <div style={{ position: 'absolute', top: '85vh', marginLeft: '10vh' }}>
                    <ListItem button>
                        <Avatar>
                            <ExitToAppIcon style={{ color: 'black' }} />
                        </Avatar>
                        <Button color="primary" style={{ fontSize: 28, color: 'blue', fontFamily: 'serif' }}>
                            Log out
                    </Button>
                    </ListItem>
                </div>
            </div>
        );

        const addInformation = (
            <div>
                <h2 id="simple-modal-title">New Taks</h2>
                <FormControl margin="normal" required fullWidth onChange={this.handleDescription}>
                    <InputLabel htmlFor="responsable">Description</InputLabel>
                    <Input id="description" name="description" type="text" />
                </FormControl>
                <FormControl margin="normal" required fullWidth onChange={this.handleResponsable}>
                    <InputLabel htmlFor="responsable">Responsable</InputLabel>
                    <Input id="responsable" name="responsable" type="text" />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="state">State</InputLabel>
                    <Select onChange={this.handleState}>
                        <option value="Ready">Ready</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </Select>
                </FormControl>
                <FormControl margin="normal" required fullWidth onChange={this.handleDueDate}>
                    <Input id="date" name="date" type="date" />
                </FormControl>
                <FormControl margin="normal" required fullWidth onChange={this.handleInputChange}>
                    <Input type="file" id="file" />
                </FormControl>
            </div>
        );

        return (
            <div>
                <React.Fragment key="left" >
                    <Toolbar>
                        <Drawer anchor="left" open={this.state.left} onClose={toggleDrawer(false)}>
                            {list}
                        </Drawer>
                        <Button onClick={toggleDrawer(true)}>
                            <MenuIcon />
                            {"Profile"}
                        </Button>
                    </Toolbar>
                </React.Fragment>
                <TaskFilter />
                {
                    this.state.user.map((task, i) => {
                        return (
                            <Cards action={task} color="blue" />
                        )
                    })
                }
                <Modal
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    closeAfterTransition
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <div style={{ backgroundColor: 'white', border: '2px solid #000', textAlign: 'center', width: 450 }} >
                        {addInformation}
                        <Button style={{ marginLeft: '55vh' }} onClick={this.handleSave} >
                            <Avatar>
                                <CheckIcon style={{ color: "red" }} />
                            </Avatar>
                        </Button>
                    </div>
                </Modal>
                <Button style={{ marginLeft: '190vh' }} onClick={this.handleOpen}>
                    <Avatar>
                        <ControlPointIcon style={{ color: "blue" }} />
                    </Avatar>
                </Button>
                <Modal
                    open={this.state.edit}
                    onClose={this.handleCloseEdit}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    closeAfterTransition
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <UserProfile close={this.handleCloseEdit} />
                </Modal>
            </div>
        );
    }

}