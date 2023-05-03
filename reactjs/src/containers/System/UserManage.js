import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./UserManage.scss"
import {getAllUsers, createNewUserServive,DeleteUserServive,UpdateUserServive} from "../../services/userService"
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import {emitter} from '../../utils/emitter'

class UserManage extends Component {

    constructor(props){
        super(props);
        this.state={
          id:'',
          arrUser:[],
          isOpenModalUser:false,
          isOpenEditModalUser:false,
          userEdit:{}
        }
    }

    async componentDidMount() {
        await this.getAllUserFormReact()
    }
    getAllUserFormReact=async()=>{
      let response= await getAllUsers("ALL")
      if(response && response.errCode===0){
        this.setState({
          arrUser:response.users
        })
      }
    }

    handleAddNewUser=()=>{
        this.setState({
          isOpenModalUser:true

        })
    }

    toggleUserModal=()=>{
      this.setState({
          isOpenModalUser: !this.state.isOpenModalUser
      })
    }

    toggleUserEditModal=()=>{
      this.setState({
        isOpenEditModalUser:!this.state.isOpenEditModalUser
      })
    }

    createNewUser=async(data)=>{
      try{
        let response=  await createNewUserServive(data)
        if(response && response.errCode !==0){
          alert(response.errMessage)
        }else{
           await this.getAllUserFormReact()
           this.setState({
              isOpenModalUser:false
           })
           emitter.emit('EVENT_CLEAR_MODAL_DATA')
        }
        console.log('response create user:',response);
      }catch(e){
        console.log(e);
      }
      
    }

    handleDelete= async(user)=>{
      try{
         let res= await DeleteUserServive(user.id)
         if(res && res.errCode===0){
            await this.getAllUserFormReact()
         }else{
            alert(res.errMessage)
         }
      }catch(e){
        console.log(e);
      }
    }

    handleEdit=(user)=>{
      this.setState({
        isOpenEditModalUser:true,
        userEdit:user
      })
    }

    handleEditUser=async(user)=>{
      try{
        let res= await UpdateUserServive(user)
        if(res && res.errCode===0){
            this.setState({
              isOpenEditModalUser:false
            })
            this.getAllUserFormReact()
        }else{
          alert(res.errMessage)
        }
      }catch(e){
        console.log(e);
      }
    }

    render() {
      let arrUser=this.state.arrUser
        return (
            <div className="user-container">
              <ModalUser
                  isOpen={this.state.isOpenModalUser}
                  toggleFormParent={this.toggleUserModal}
                  createNewUser={this.createNewUser}
              />
              {
                this.state.isOpenEditModalUser &&
                <ModalEditUser
                isOpen={this.state.isOpenEditModalUser}
                toggleFormParent={this.toggleUserEditModal}
                currentUser={this.state.userEdit}
                editUser={this.handleEditUser}
            />
              }
                <div className='title text-center'>Hieu</div>
                <div className='mx-1'>
                  <button className='btn btn-primary px-3'
                  onClick={()=>this.handleAddNewUser()}
                  >
                    <i className="fas fa-plus"></i>Add new user</button>
                </div>
                    <div className='user-table mt-3 mx-1'>
                    <table id="customers">
 <tbody>
 <tr>
    <th>Email</th>
    <th>First name</th>
    <th>Last name</th>
    <th>Address</th>
    <th>Actions</th>
  </tr>
  
  {arrUser && arrUser.map((item,index)=>{
    return(
      <tr>
        <td>{item.email}</td>
        <td>{item.firstName}</td>
        <td>{item.lastName}</td>
        <td>{item.address}</td>
        <td>
          <button className='btn-edit' onClick={()=> this.handleEdit(item)}><i className="fas fa-pencil-alt"></i></button>
          <button className='btn-delete' onClick={()=> this.handleDelete(item)}><i className="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    )
  })
  } 
  </tbody>
                    </table>
                    </div>
                
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
