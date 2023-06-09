/* <Modal
          role={"dialog"}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            },
            content: {
              position: "absolute",
              top: "40px",
              left: "40px",
              right: "40px",
              bottom: "40px",
              border: "1px solid #ccc",
              background: "#fff",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              padding: "20px",
              height: "200px",
              width: "380px",
              margin: "auto",
            },
          }}
          autoFocus={true}
          data={edgeWeight}
          isOpen={modalOpen}
          onRequestClose={handleModalClose}
          contentLabel="Edge Weight Modal"
        >
          <h2>Enter the edge weight</h2>
          <br />
          <input
            type="number"
            value={edgeWeight}
            autoFocus={true}
            onChange={handleWeightChange}
          />
          <button onClick={handleModalClose}>Submit</button>
        </Modal> */
