import React, { Component } from "react";
import { connect } from "react-redux";
import fetch from "node-fetch";
import AbortController from "abort-controller";
import Heading from "arui-feather/heading";
import Label from "arui-feather/label";
import Form from "arui-feather/form";
import FormField from "arui-feather/form-field";
import Input from "arui-feather/input";
import Select from "arui-feather/select";
import Button from "arui-feather/button";
import Notification from "arui-feather/notification";
import Verifying from "arui-feather/icon/ui/verifying";
import Ok from "arui-feather/icon/ui/ok";

import "./App.css";

class App extends Component {
  componentDidMount() {
    this.props.resetController(); // Init & save controller in the store
  }

  render() {
    return (
      <div>
        <Heading>{this.props.title}</Heading>
        <img src={this.props.image} />
        <Form
          method="post"
          onSubmit={(event) => {
            for (let i = 0; i < this.props.fields.length; i++) {
              this.props.saveValue(event.target[i].name, event.target[i].value); // Preparing the form object
            }
            console.log(this.props.form.numeric);
            this.props.openNotify(); // Open notification with default params
            // Fetching own api
            fetch("/api/sendForm", {
              headers: {
                "Content-Type": "application/json", // Default header for json data
              },
              method: "POST",
              signal: this.props.controller.signal, // Bind controller
              body: JSON.stringify({ form: this.props.form }), // Fill the body
            })
              .then((res) => res.json())
              .then((data) => {
                this.props.complateNotify(data.result); // Send result to the already opened notification
                this.props.resetController(); // Init new controller and save in the store
              });
          }}
        >
          {this.props.fields.map((item, index) => (
            <FormField key={index} className="row">
              <Label>{item.title}</Label>
              {(() => {
                switch (item.type) {
                  case "NUMERIC":
                    return (
                      <Input name={item.name} className="item" type="number" />
                    );
                  case "LIST":
                    return (
                      <Select
                        name={item.name}
                        mode="radio"
                        options={(() => {
                          let arr = [];
                          for (const [key, value] of Object.entries(
                            item.values
                          )) // Convert to a suitable object for Select
                            arr.push({
                              value: key,
                              text: value,
                            });
                          return arr;
                        })()}
                        className="item"
                      />
                    );
                  default:
                    return <Input name={item.name} className="item" />;
                }
              })()}
            </FormField>
          ))}
          <FormField>
            <Button view="extra" type="submit">
              Отправить
            </Button>
          </FormField>
        </Form>
        <Notification
          visible={this.props.notify.opened}
          status="ok"
          offset={12}
          stickTo="left"
          icon={
            this.props.notify.complated ? (
              <Ok colored={true} />
            ) : (
              <Verifying theme="alfa-on-color" />
            )
          }
          title={this.props.notify.complated ? "Результат!" : "Ожидание..."}
          onCloseTimeout={() => {
            if (this.props.notify.opened && !this.props.notify.complated) {
              this.props.controller.abort(); // Abort fetching
              this.props.resetController();
            }
            this.props.closeNotify();
          }}
          onCloserClick={() => {
            if (this.props.notify.opened && !this.props.notify.complated) {
              this.props.controller.abort();
              this.props.resetController();
            }
            this.props.closeNotify();
          }}
        >
          {this.props.notify.complated
            ? this.props.notify.complated
            : "Ожидание результата..."}
        </Notification>
      </div>
    );
  }
}

const mapStateToProps = ({
  title,
  image,
  fields,
  form,
  notify,
  controller,
}) => ({
  title,
  image,
  fields,
  form,
  notify,
  controller,
});

const mapDispatchToProps = (dispatch) => ({
  saveValue: (name, value) => dispatch({ type: "SAVE_VALUE", name, value }),
  openNotify: () =>
    dispatch({ type: "NOTIFY", notify: { opened: true, complated: false } }),
  complateNotify: (result) =>
    dispatch({ type: "NOTIFY", notify: { opened: true, complated: result } }),
  closeNotify: () =>
    dispatch({ type: "NOTIFY", notify: { opened: false, complated: false } }),
  resetController: () =>
    dispatch({ type: "CONTROLLER", controller: new AbortController() }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
