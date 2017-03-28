import React from 'react';

import Avatar from '../Avatar';
import TooltipMixin from '../../mixins/tooltip';
import ApiMixin from '../../mixins/apiMixin';
import GroupState from '../../mixins/groupState';

import {t} from '../../locale';

const SuggestedOwners = React.createClass({
  propTypes: {
    event: React.PropTypes.object,
  },

  mixins: [
    ApiMixin,
    GroupState,
    TooltipMixin({
      selector: '.tip',
      container: 'body'
    })
  ],

  getInitialState(){
      return {owners: undefined};
  },

  componentDidMount(){
    this.fetchData(this.props.event);
  },

  componentWillReceiveProps(nextProps){
    if(this.props.event != nextProps.event){
      this.fetchData(nextProps.event);
    }
  },

  fetchData(event){
    if(!event) return;
    let org = this.getOrganization();
    let project = this.getProject();
    this.api.request(`/projects/${org.slug}/${project.slug}/events/${event.id}/committers/`, {
      success: (data, _, jqXHR) => {
        this.setState({
          owners: data.committers,
        });
      },
      error: (error) => {
        this.setState({
          owners: undefined,
        });
      }
    });
  },

  renderCommitter(props){
    return (
      <span className="avatar-grid-item tip" title={`Click to assign ${props.name}`}>
        <Avatar user={props}/>
      </span>);
  },

  render() {
    if(!this.state.owners){
      return null;
    }
    return(
      <div className="m-b-1">
        <h6><span>{t('Suggested Owners')}</span></h6>
        <div className="avatar-grid">
          {this.state.owners.map(c => this.renderCommitter(c))}
        </div>
      </div>
    );
  }
});

export default SuggestedOwners;
