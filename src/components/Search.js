import React from "react";
import { MDBCol, MDBIcon } from "mdbreact";

const Search = () => {
    return (
        <MDBCol md="6">
            <div className="input-group md-form form-sm form-1 pl-0">
                <input className="form-control my-0 py-1 border border-light" type="text" placeholder="Search" aria-label="Search" />
                <div className="input-group-prepend">
                    <span className="input-group-text grey lighten-3" id="basic-text1">
                        <MDBIcon className="text-white" icon="search" />
                    </span>
                </div>
            </div>
        </MDBCol>
    );
}

export default Search;