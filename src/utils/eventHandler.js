import Vue from 'Vue'
import {getRequest} from '../utils/api'
Vue.prototype.getRequest = getRequest;
export default new Vue();