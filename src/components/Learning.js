import React, { Component } from 'react';
import Criteria from './Criteria';
import { Link } from 'react-router-dom';
import * as Actions from '../actions/assessments';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import uuidv1 from 'uuid/v1';
import mixpanel from 'mixpanel-browser';

class Learning extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeRubricIndex: null,
    }
    this.icons = [ "dashboard", "explore", "code", "backup", "lock", "bug_report", "line_style", "perm_identity", "star_rate" ]
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  componentWillMount() {
    const userId = localStorage.getItem('userId')
    this.props.getAssessments(userId)
    const rubricIndex = this.props.match.params.id
    this.setState({activeRubricIndex: rubricIndex})
  }

  componentDidMount() {
    mixpanel.init('333f6269317ae9b78a29c535e29f00bf')
    mixpanel.track("Learning Mode Page");
  }

  renderDropdown() {
    const { assessmentsObject: assessments } = this.props.assessments
    console.log('ASSESSMENTS:', assessments)
    if (assessments.length > 0) {
      return (
        <select
          className="selectpicker"
          value={this.state.activeRubricIndex}
          data-style="btn btn-rose btn-round"
          title="Select One of Your Tracked Skills"
          data-size="70"
          onChange={this.handleDropdownChange}>
          <option value={0} disabled >Select a Skill</option>
          {assessments.map((assessment, index) => {
            const { id, name, iconName } = assessment.rubricJSON
            console.log('NAME', name)
            return (
              <option value={id} key={id}>
                <strong>
                  <i className="material-icons">{iconName}</i>
                  &nbsp; {name}
                </strong>
              </option>
            )
          })}
        </select>
      )
    }
    return null
  }

  handleDropdownChange(event) {
    this.setState({activeRubricIndex: event.target.value})
    this.props.history.push(`/learn/${event.target.value}`)
  }

  render() {
    const { isFetching, assessmentsObject: assessments } = this.props.assessments;
    return (
      <div className="col-md-12">
        <div className="card">
          <div className="card-header card-header-icon" style={{display: `inline`}} data-background-color="rose">
            <i className="material-icons">check_circle</i>
          </div>
          <div className="card-header" style={{display: `inline`}}>
            <h1 style={{display: `inline`}}><small>Learning Mode</small></h1>
            <div className="col-xs-12">
              <h5 className="description">
                After you add a skill and take an intial assessment you can update your progress here.
                You can level up your skills by seeing what you need to level up next!
              </h5>
            </div>
          </div>
          <div className="card-content">
            <div className="row">
              <div className="col-md-5">
                {this.renderDropdown()}
              </div>
            </div>
            <div className="row">
              <div className="col-12">

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    assessments: state.assessments
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Learning));
