package umm3601.machine;

import org.bson.Document;
import spark.Request;
import spark.Response;

/**
 * Created by Brian on 11/29/2017.
 */
public class MachineRequestHandler {

  private final MachineController machineController;

  public MachineRequestHandler(MachineController machineController) {
    this.machineController = machineController;
  }

  /**
   * Method called from Server when the 'api/machines/:id' endpoint is received.
   * Get a JSON response with a list of all the machines in the database.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return one machine in JSON formatted string and if it fails it will return text with a different HTTP status code
   */
  public String getMachineJSON(Request req, Response res) {
    res.type("application/json");
    String id = req.params("id");
    String machine;
    try {
      machine = machineController.getMachine(id);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested machine id " + id + " wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (machine != null) {
      return machine;
    } else {
      res.status(404);
      res.body("The requested machine with id " + id + " was not found");
      return "";
    }
  }


  /**
   * Method called from Server when the 'api/machines' endpoint is received.
   * This handles the request received and the response
   * that will be sent back.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return an array of machines in JSON formatted String
   */
  public String getMachines(Request req, Response res) {
    res.type("application/json");
    return machineController.getMachines(req.queryMap().toMap());
  }


  /**
   * Method called from Server when the 'api/machines/new' endpoint is received.
   * Gets specified machine info from request and calls addNewMachine helper method
   * to append that info to a document
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return a boolean as whether the machine was added successfully or not

  public String addNewMachine(Request req, Response res) {
    res.type("application/json");

    Document newMachine = Document.parse(req.body());

    String name = newMachine.getString("name");
    int age = newMachine.getInteger("age");
    String company = newMachine.getString("company");
    String email = newMachine.getString("email");

    System.err.println("Adding new machine [name=" + name + ", age=" + age + " company=" + company + " email=" + email + ']');
    return machineController.addNewMachine(name, age, company, email);
  }
  */
}
