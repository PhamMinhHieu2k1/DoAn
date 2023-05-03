import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getListPatientForDoctor , postSendRemedy} from '../../../services/userService';
import moment  from 'moment';
import { toast } from 'react-toastify';
import { languages } from '../../../utils';
import RemedyModal from './RemedyModal';
import { FormattedMessage } from 'react-intl';

class ManagePatient extends Component {
    constructor(props){
        super(props)
        this.state={
            currentDate:moment(new Date()).startOf('day').valueOf(),
            dataPatient:[],
            isOpenRemedyModal:false,
            dataModal:{}
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

   
    async componentDidMount(){
        
        this.getDataPatient()
        
    }

    getDataPatient=async()=>{
        let user= this.props.user
        let currentDate= this.state.currentDate
        let formatedDate=new Date(currentDate).getTime()
        let res=await getListPatientForDoctor({
            doctorId:user.id,
            date:formatedDate
        })
        if(res && res.errCode===0){
            this.setState({
                dataPatient:res.data
            })
        }
    }

    async componentDidUpdate(prevProps,prevState,snapshot){
        if(this.props.language !== prevProps.language){

         
        }
    }

    handleOnChangeDatePicker=(date)=>{
        this.setState({
            currentDate:date[0]
        },async()=>{
           
           await this.getDataPatient()
        })
    }

    handleBtnConfirm=(item)=>{    
        
        let data={
            doctorId:item.doctorId,
            patientId:item.patientId,
            email:item.patientData.email,
            timeType:item.timeType,
            patientData:item.patientData.firstName
        }
        this.setState({
            isOpenRemedyModal:true,
            dataModal:data
        })
    }

    closeRemedyModal=()=>{
        this.setState({
            isOpenRemedyModal:false,
            dataModal:{}
        })
    }

    sendRemedy=async(dataChild)=>{
        let dataModal= this.state.dataModal
        let res=await postSendRemedy({
            email:dataChild.email,
            imgBase64:dataChild.imgBase64,
            doctorId:dataModal.doctorId,
            patientId:dataModal.patientId,
            timeType: dataModal.timeType,
            language:this.props.language,
            patientData:dataModal.patientData
        })
        if(res && res.errCode===0){
            toast.success("Send Remedy success!")
            this.closeRemedyModal()
            await this.getDataPatient()
        }else{
            toast.error("Send Remedy error!")
            console.log("Send Remedy error!", res);
        }
    }

    render() {

        console.log("check state patient", this.state);
        let dataPatient= this.state.dataPatient
        let isOpenRemedyModal= this.state.isOpenRemedyModal
        let dataModal= this.state.dataModal

        let language= this.props.language

       
        return (
            <>
           <div className='manage-patient-container'>
                <div className='m-p-title title'>
                    <FormattedMessage id="doctor.manage-patient"/>
                </div>
                <div className='manage-patient-body row'>
                    <div className='col-4 form-group'>
                        <label> <FormattedMessage id="doctor.choose-date"/></label>
                        <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                            />
                    </div>
                    <div className='col-12 table-manage-patient' >
                    <table className='table-manage-patient'>
                        <tbody>
                        <tr>
                            <th>STT</th>
                            <th> <FormattedMessage id="doctor.time"/></th>
                            <th> <FormattedMessage id="doctor.name"/></th>
                            <th> <FormattedMessage id="doctor.address"/></th>
                            <th> <FormattedMessage id="doctor.gender"/></th>
                            <th>Actions</th>
                        </tr>
                        {dataPatient && dataPatient.length > 0 ?
                            dataPatient.map((item,index)=>{
                                let time= language=== languages.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn
                                let gender= language=== languages.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{time}</td>
                                        <td>{item.patientData.firstName}</td>
                                        <td>{item.patientData.address}</td>
                                        <td>{gender}</td>
                                        <td>
                                            <button 
                                                className='mp-btn-confirm'
                                                onClick={()=>this.handleBtnConfirm(item)}
                                            >
                                                 <FormattedMessage id="doctor.confirm"/>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            <tr>
                                <td colSpan="6">Không có lịch hẹn</td>
                            </tr>
                        }
                        
                         
                         </tbody>
                        </table>
                    </div>
                </div>
           </div>
           
           <RemedyModal
                isOpenModal={isOpenRemedyModal}
                dataModal={dataModal}
                closeRemedyModal={this.closeRemedyModal}
                sendRemedy={this.sendRemedy}
            />
           </>
        );
    }
    }


const mapStateToProps = state => {
    return {
        language:state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
