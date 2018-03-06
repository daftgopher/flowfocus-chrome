import React from 'react';
import styles from './appStyles.scss';
import { connect } from 'react-redux';

import updateLastAlert from 'Actions/updateLastAlert';

import AlertMessage from 'Components/AlertMessage/alertMessage.jsx';
import Header from 'Components/Header/header.jsx';
import DomainList from 'Components/DomainList/domainList.jsx';
import CurrentDomainStatus from 'Components/CurrentDomainStatus/currentDomainStatus.jsx';
import Footer from 'Components/Footer/footer.jsx';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {buttonDisabled: false};
    this.currentDomainHasUserAlert = this.currentDomainHasUserAlert.bind(this);
  }

  componentDidUpdate(prevProps){
    if (this.props.lastAlert && (prevProps.lastAlert !== this.props.lastAlert) ){
      this.triggerToastMessage(this.props.lastAlert);
    }
  }

  triggerToastMessage(){
    this.setState({isAlertActive: true}, () => {
      window.setTimeout(() => this.setState({isAlertActive: false}), 3000);
    });
  }

  currentDomainHasUserAlert(){
    const domain = this.props.domainList.find( obj => obj.domain === this.props.currentDomain);
    return !!domain.hasAlert;
  }

  render(){
    const {currentDomain, domainList = [], addAlert, updateAlert, lastAlert = null} = this.props;
    const triggerAlert = (currentDomain) => {
      addAlert(currentDomain);
      updateAlert(`Distraction alert added for ${currentDomain}`);
    };
    const renderMainView = () => {
      const currentDomainObj = domainList.find(obj => obj.domain === currentDomain);
      const currentDomainCount = currentDomainObj ? currentDomainObj.count : 0;
      return (
        <div>
          <CurrentDomainStatus name={currentDomain} count={currentDomainCount} />
          <DomainList domainList={domainList} />
          <Footer
            clickHandler={() => triggerAlert(currentDomain)}
            currentDomain={currentDomain}
            hasAlert={this.currentDomainHasUserAlert()}
          />
        </div>
      );
    };

    return(
      <div>
        <AlertMessage isActive={this.state.isAlertActive} text={lastAlert} />
        <Header />
        <main id="main" className={styles.main}>
          {renderMainView()}
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentDomain: state.currentDomain,
    domainList: state.domainList,
    lastAlert: state.lastAlert
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAlert: (domain) => dispatch({
      type: 'update-domain-properties',
      domain: domain,
      propertiesObj: {hasAlert: true}
    }),
    updateAlert: (alertMessage) => {
      dispatch(updateLastAlert(alertMessage));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
