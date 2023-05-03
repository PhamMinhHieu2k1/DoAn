import React, { Component } from 'react';
import { connect } from "react-redux";
import './RemedyModal.scss';
import {  Modal , ModalHeader,ModalBody,ModalFooter, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import {languages,CRUD_ACTIONS , CommonUtils} from "../../../utils"


class RemedyModal extends Component {
    constructor(props){
        super(props)
        this.state={
            email:'',
            imgBase64:''
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

   
    componentDidMount(){
      if(this.props.dataModal){
        this.setState({
            email:this.props.dataModal.email
        })
      }
    }

    componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.dataModal !== this.props.dataModal){
            this.setState({
                email:this.props.dataModal
            })
        }
    }
   
    handleOnChangeEmail=(event)=>{
        this.setState({
            email:event.target.value
        })
    }
    handleChangeImg= async(event)=>{
        let data= event.target.files
        let file= data[0];
        if(file){
            let base64=await CommonUtils.getBase64(file)
            this.setState({
                imgBase64:base64
                
            })
        }         
    }

    handleSendRemedy=()=>{
       this.props.sendRemedy(this.state)
    }

    render() {

        let isOpenModal= this.props.isOpenModal
        let closeRemedyModal= this.props.closeRemedyModal
        let dataModal=this.props.dataModal
        let sendRemedy= this.props.sendRemedy
       
        return (
            
             <Modal 
             isOpen={isOpenModal} 
            className={"booking-modal-container"}
            size="lg"
            centered
            >   
                <div className='modal-header'>
                    <h5 className='modal-title'>Gửi hóa đơn khám bệnh </h5>
                    <button type='button' className='close' aria-label='Close' onClick={closeRemedyModal}>
                        <span aria-hidden="true" >x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            
                                <label>Email bệnh nhân</label>
                                <input 
                                    className='form-control' 
                                    type='email' 
                                    value={dataModal.email}
                                    onChange={(event)=>this.handleOnChangeEmail(event)}
                                    ></input>
                           
                        </div>
                        <div className='col-6 form-group'>
                            <label>Chọn file đơn thuốc</label>
                            <input 
                                className='col-12 form-control-file' 
                                type='file' 
                                onChange={(event)=>this.handleChangeImg(event)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' className='btn-send' onClick={()=>this.handleSendRemedy()}>Gửi</Button>
                    <Button color='secondary' className='btn-send' onClick={closeRemedyModal}>Hủy</Button>
                </ModalFooter>

            </Modal>
           
        );
    }
    }


const mapStateToProps = state => {
    return {
        language:state.app.language,
       
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
