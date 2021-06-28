import { recurse } from 'cypress-recurse';

describe('ArFile download Monitor', function () {


    it('Test run', () => {
        cy.log("faltu");
    });

    it('Login into application', () => {
        cy.task('getAadToken').then(() => cy.loadTokensValues());
        cy.wait(2000);
        cy.visit("https://genesis-qa.dovertech.co.in/admin/devicemanagement/viewDevices");
        cy.title().should('include', 'Genesis Cloud');
    });

    it('Navigate to Mange Device Page', () => {

        cy.wait(10000);
        cy.xpath("//button[normalize-space()='Filter By']").click();
        cy.get("select[formcontrolname='status']").select("Connected").should('have.value', '1: Connected');
        cy.xpath("//div[normalize-space()='Apply' and contains(@class,'cvcbuttonstyle')]").click()
        cy.intercept('POST', 'https://genesis-qa.dovertech.co.in/api/devicemgmt/filter').as('ConFilter');
        cy.wait('@ConFilter',{timeout: 15000}).then(xhr => {
            expect(xhr).to.be.an('object');
            const responseBody = JSON.parse(xhr.response.body);
            cy.log(responseBody.data);
            //expect().to.have.length(3);
            cy.wait(3000);
            cy.visit("https://genesis-qa.dovertech.co.in/admin/devicemanagement/createUpdateDevice/8bf6cd3a05554c56a73323b6c6878ee0");
        });

    });
})