import React from 'react';
import styles from './appStyles.scss';
import { connect } from 'react-redux';

import updateLastNotification from 'Actions/updateLastNotification';

import CurrentDomainStatus from 'Components/CurrentDomainStatus/currentDomainStatus.jsx';
import DomainAlertList from 'Components/DomainAlertList/domainAlertList.jsx';
import DomainList from 'Components/DomainList/domainList.jsx';
import Footer from 'Components/Footer/footer.jsx';
import Header from 'Components/Header/header.jsx';
import ToastNotification from 'Components/ToastNotification/toastNotification.jsx';

import BellImage from 'Images/notification_bell.svg';
import XMarkImage from 'Images/x_mark.svg';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      buttonDisabled: false,
      editingAlerts: false
    };
    this.currentDomainHasUserAlert = this.currentDomainHasUserAlert.bind(this);
    this.renderList = this.renderList.bind(this);
    this.toggleListState = this.toggleListState.bind(this);
  }

  componentDidUpdate(prevProps){
    if (this.props.lastNotification && (prevProps.lastNotification !== this.props.lastNotification)){
      this.triggerToastMessage(this.props.lastNotification);
    }
  }

  triggerToastMessage(){
    this.setState({isAlertActive: true}, () => {
      window.setTimeout(() => this.setState({isAlertActive: false}), 3000);
    });
  }

  toggleListState(){
    this.setState({editingAlerts: !this.state.editingAlerts});
  }

  currentDomainHasUserAlert(){
    const domain = this.props.domainList.find( obj => obj.domain === this.props.currentDomain);
    return domain ? !!domain.hasAlert : false;
  }

  renderList(domainList){
    const removeAlert = (selectedDomain) => {
      this.props.removeAlert(selectedDomain);
      this.props.toastNotification(`${selectedDomain} removed from alerts`);
    };
    if (this.state.editingAlerts){
      const alertList = domainList.filter(obj => obj.hasAlert);
      return <DomainAlertList domainList={alertList} removeAlert={removeAlert} backToList={this.toggleListState} />;
    }
    return <DomainList domainList={domainList} />;
  }

  render(){
    const {
      currentDomain,
      domainList = [],
      addAlert, // From Redux store
      toastNotification, // From Redux store
      lastNotification = null
    } = this.props;

    const triggerAlert = (currentDomain) => {
      addAlert(currentDomain);
      toastNotification(`Distraction alert added for ${currentDomain}`);
    };

    const currentDomainObj = domainList.find(obj => obj.domain === currentDomain);
    const currentDomainCount = currentDomainObj ? currentDomainObj.count : 0;

    return(
      <div className={styles.appWrap}>
        <ToastNotification isActive={this.state.isAlertActive} text={lastNotification} />
        <div className={styles.utilityActions}>

          { !this.state.editingAlerts &&
            <div className={styles.manageAlertsButton} onClick={this.toggleListState}>
              <span><BellImage className={styles.bellImage} /> Manage Alerts</span>
            </div>
          }
          {
            this.state.editingAlerts &&
            <div className={styles.manageAlertsButton} onClick={this.toggleListState}>
              <span><XMarkImage className={styles.xMark} /> Back</span>
            </div>
          }
        </div>
        <Header />
        <main id="main" className={styles.main}>
          <div>
            <CurrentDomainStatus name={currentDomain} count={currentDomainCount} />
            {this.renderList(domainList)}
            <Footer
              clickHandler={() => triggerAlert(currentDomain)}
              currentDomain={currentDomain}
              hasAlert={this.currentDomainHasUserAlert()}
            />
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentDomain: state.currentDomain,
    domainList: state.domainList,
    lastNotification: state.lastNotification
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAlert: (domain) => dispatch({
      type: 'update-domain-properties',
      domain: domain,
      propertiesObj: {hasAlert: true}
    }),
    removeAlert: (domain) => dispatch({
      type: 'update-domain-properties',
      domain: domain,
      propertiesObj: {hasAlert: false}
    }),
    toastNotification: (message) => {
      dispatch(updateLastNotification(message));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
