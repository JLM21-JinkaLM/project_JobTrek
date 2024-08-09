function SearchMain() {
  return (
    <div className="container">
      <div className="jumbotron mt-5 ">
        <h1 className="display-5">Find Job</h1>
        <p className="lead">Search jobs by skill, location, and category.</p>
        <form>
          <div className="form-row">
            <div className="form-group col-md-4">
              <input type="text" className="form-control" id="inputSkill" placeholder="Skill" />
            </div>
            <div className="form-group col-md-4">
              <input
                type="text"
                className="form-control"
                id="inputLocation"
                placeholder="Location"
              />
            </div>
            <div className="form-group col-md-4">
              <select id="inputCategory" className="form-control">
                <option selected>Choose Category...</option>
                <option>Software Development</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Design</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchMain;
