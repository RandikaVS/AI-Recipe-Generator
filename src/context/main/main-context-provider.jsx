import PropTypes from 'prop-types';
import {useMemo, useReducer, useCallback, useEffect} from 'react';

import axios, {endpoints} from '../../utils/axios';

import {MainContext} from './main-context';

const initialState = {
  loading: false,
};

const reducer = (state, action) => {

  if (action.type === 'INITIAL') {
    return {
      ...initialState,
    };
  }
  if (action.type === 'LOADING_START') {
    return {
      ...state,
      loading: true,
    };
  }
  if (action.type === 'LOADING_END') {
    return {
      ...state,
      loading: false,
    };
  }
  return state;

};

// ----------------------------------------------------------------------

export function MainContextProvider({children}) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {

    dispatch({
      type: 'INITIAL',
      payload: {...initialState}
    });

  },[]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const createQuatation = useCallback(async (quatation,bankAdmin,formData) => {

    formData.append('civilStatus',quatation.civilStatus)
    formData.append('coverList',quatation.coverList)
    formData.append('createDate',quatation.createDate)
    formData.append('customerAddress',quatation.customerAddress)
    formData.append('customerName',quatation.customerName)
    formData.append('dob',quatation.dob)
    formData.append('gender',quatation.gender)
    formData.append('bankAccount',quatation.bankAccount)
    formData.append('insurancePolicy',quatation.insurancePolicy)
    formData.append('interestRate',quatation.interestRate)
    formData.append('loanAmount',quatation.loanAmount)
    formData.append('loanPeriod',quatation.loanPeriod)
    formData.append('loanPurpose',quatation.loanPurpose)
    formData.append('mobileNumber',quatation.mobileNumber)
    formData.append('nic',quatation.nic)
    formData.append('profession',quatation.profession)
    formData.append('referanceNo',quatation.referanceNo)
    formData.append('remarks',quatation.remarks)
    formData.append('refAdmin',bankAdmin?._id)

  //   const newQuatation = {
  //     civilStatus: quatation.civilStatus,
  //     coverList: quatation.coverList,
  //     createDate: quatation.createDate,
  //     customerAddress: quatation.customerAddress,
  //     customerName: quatation.customerName,
  //     dob: quatation.dob,
  //     gender: quatation.gender,
  //     bankAccount: quatation.bankAccount,
  //     insurancePolicy: quatation.insurancePolicy,
  //     interestRate: quatation.interestRate,
  //     loanAmount: quatation.loanAmount,
  //     loanPeriod: quatation.loanPeriod,
  //     loanPurpose: quatation.loanPurpose,
  //     mobileNumber: quatation.mobileNumber,
  //     nic: quatation.nic,
  //     profession: quatation.profession,
  //     referanceNo: quatation.referanceNo,
  //     remarks: quatation.remarks,
  //     refAdmin:bankAdmin?._id
  // };

    const response = await axios.post(endpoints.quatation.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { success, message,data } = response.data;
    
    dispatch({
      type: 'CREATE_QUATATION',
      payload: {
        new_quatation: {
          success,
          message,
          data
        },
      },
    });
  }, []);
  
  const getQuatationByUserId = useCallback(async () => {

    const response = await axios.get(endpoints.quatation.get_by_user_id);

    const { success, message,data } = response.data;
    
    dispatch({
      type: 'GET_QUATATION_BY_USER',
      payload: {
        quatations: {
          data,
          success,
          message
        },
      },
    });
  }, []);

 


  // ----------------------------------------------------------------------


  const memoizedValue = useMemo(
    () => ({
      loading: state.loading,

      createQuatation,
      getQuatationByUserId,
     
    }), [
          createQuatation, 
          getQuatationByUserId, 
          state.loading,
          state
        ]);

  return <MainContext.Provider value={memoizedValue}>{children}</MainContext.Provider>;
}

MainContextProvider.propTypes = {
  children: PropTypes.node,
};
