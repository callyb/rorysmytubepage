import React, { Component } from "react";
import { MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink, } from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import GiveConsent from './GiveConsent';
import SubscribeForm from './SubscribeForm';
import ChangeEmail from './ChangeEmail';
import DeleteSubscription from './DeleteSubscription';

class ManageUser extends Component {
    state = {
        activeItem: "1"
    };

    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    render() {
        return (
            <Router>
                <MDBContainer>
                    <MDBNav className="nav-tabs">
                        <MDBNavItem>
                            <MDBNavLink link to="#" active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                                Subscribe
           </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink link to="#" active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                                Consent
            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink link to="#" active={this.state.activeItem === "3"} onClick={this.toggle("3")} role="tab" >
                                Change Email
            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink link to="#" active={this.state.activeItem === "4"} onClick={this.toggle("4")} role="tab" >
                                Delete Subscriber
            </MDBNavLink>
                        </MDBNavItem>
                    </MDBNav>
                    <MDBTabContent activeItem={this.state.activeItem} >
                        <MDBTabPane tabId="1" role="tabpanel">
                            <div className="mt-2">
                                <SubscribeForm />
                            </div>
                        </MDBTabPane>

                        <MDBTabPane tabId="2" role="tabpanel">
                            <div className="mt-2">
                                <GiveConsent />
                            </div>

                        </MDBTabPane>
                        <MDBTabPane tabId="3" role="tabpanel">
                            <div className="mt-2">
                                <ChangeEmail />
                            </div>
                        </MDBTabPane>

                        <MDBTabPane tabId="4" role="tabpanel">
                            <div className="mt-2">
                                <DeleteSubscription />
                            </div>
                        </MDBTabPane>
                    </MDBTabContent>
                </MDBContainer>
            </Router>
        );
    }
}
export default ManageUser;