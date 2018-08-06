import Vue from 'vue'
import {getRequest} from '../utils/api'
Vue.prototype.getRequest = getRequest;
export default new Vue();