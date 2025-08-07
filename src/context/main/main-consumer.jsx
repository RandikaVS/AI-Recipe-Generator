import PropTypes from 'prop-types';


import { MainContext } from './main-context';
import SplashScreen from '../../components/SplashScreen';

// ----------------------------------------------------------------------

export function MainConsumer({ children }) {
  return (
    <MainContext.Consumer>
      {(main) => (main.loading ? <SplashScreen /> : children)}
    </MainContext.Consumer>
  );
}

MainConsumer.propTypes = {
  children: PropTypes.node,
};
