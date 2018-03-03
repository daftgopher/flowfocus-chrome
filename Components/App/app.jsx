import React from 'react';
import styles from './appStyles.scss';
import { connect } from 'react-redux';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import Transition from 'Components/Transition/transition.jsx';
import { toggleForm } from 'Actions/form.js';
import Header from 'Components/Header/header.jsx';
import DomainList from 'Components/DomainList/domainList.jsx';
import CurrentDomainStatus from 'Components/CurrentDomainStatus/currentDomainStatus.jsx';
import DomainForm from 'Components/DomainForm/domainForm.jsx';
import Footer from 'Components/Footer/footer.jsx';

const App = ({currentDomain, domainList, formActive, toggleForm}) => {

  const processDomain = () => {

  };

  const renderMainView = () => {
    if (formActive) {
      return (
        <Transition>
          <DomainForm submitHandler={processDomain} />
        </Transition>
      );
    }
    return (
      <div>
        <CurrentDomainStatus name={currentDomain} count={currentDomainCount} />
        <DomainList domainList={domainList} />
        <Footer clickHandler={toggleForm} />
      </div>
    );
  };

  const currentDomainCount = domainList.find( (obj) => obj.domain === currentDomain ).count;

  return(
    <div>
      <Header />
      <main id="main" className={styles.main}>
        <TransitionGroup>
          {renderMainView()}
        </TransitionGroup>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentDomain: state.currentDomain,
    domainList: state.domainList,
    formActive: state.form.active
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleForm: () => dispatch(toggleForm())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
