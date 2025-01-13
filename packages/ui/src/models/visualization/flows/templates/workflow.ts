import { getCamelRandomId } from '../../../../camel-utils/camel-random-id';

export const workflowTemplate = () => {
  const workflowId = getCamelRandomId('workflow');

  return `apiVersion: organizer.apache.com/v2
kind: Workflow
description: Transmission Network Model Validator
metadata:
  name: ${workflowId}
  annotations:
    organizer.apache.com/workflow.autostart: true
    organizer.apache.com/process-model.configuration-route: v1.com.gridos.organizer.plugin.uta.rtnstudy.checkPoolSeServicesStatus
    organizer.apache.com/process-model.service-allocation-route: v1.com.gridos.organizer.plugin.uta.study.initializeStudyInstance
    organizer.apache.com/process-model.service-deallocation-route: v1.com.gridos.organizer.plugin.uta.study.destroyStudyInstance
    organizer.apache.com/process-model.initialization-route: v1.com.gridos.organizer.plugin.uta.rtnstudy.initializeSE
    organizer.apache.com/process-model.pod-event-route: v1.com.gridos.organizer.plugin.uta.rtnstudy.handleSeCrashEvent
    camel.apache.org/workflow.support.level: "Stable"
    camel.apache.org/catalog.version: "main-SNAPSHOT"
    camel.apache.org/workflow.icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNjAgNjAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYwIDYwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGQ9Ik00OC4wMTQsNDIuODg5bC05LjU1My00Ljc3NkMzNy41NiwzNy42NjIsMzcsMzYuNzU2LDM3LDM1Ljc0OHYtMy4zODFjMC4yMjktMC4yOCwwLjQ3LTAuNTk5LDAuNzE5LTAuOTUxCgljMS4yMzktMS43NSwyLjIzMi0zLjY5OCwyLjk1NC01Ljc5OUM0Mi4wODQsMjQuOTcsNDMsMjMuNTc1LDQzLDIydi00YzAtMC45NjMtMC4zNi0xLjg5Ni0xLTIuNjI1di01LjMxOQoJYzAuMDU2LTAuNTUsMC4yNzYtMy44MjQtMi4wOTItNi41MjVDMzcuODU0LDEuMTg4LDM0LjUyMSwwLDMwLDBzLTcuODU0LDEuMTg4LTkuOTA4LDMuNTNDMTcuNzI0LDYuMjMxLDE3Ljk0NCw5LjUwNiwxOCwxMC4wNTYKCXY1LjMxOWMtMC42NCwwLjcyOS0xLDEuNjYyLTEsMi42MjV2NGMwLDEuMjE3LDAuNTUzLDIuMzUyLDEuNDk3LDMuMTA5YzAuOTE2LDMuNjI3LDIuODMzLDYuMzYsMy41MDMsNy4yMzd2My4zMDkKCWMwLDAuOTY4LTAuNTI4LDEuODU2LTEuMzc3LDIuMzJsLTguOTIxLDQuODY2QzguODAxLDQ0LjQyNCw3LDQ3LjQ1OCw3LDUwLjc2MlY1NGMwLDQuNzQ2LDE1LjA0NSw2LDIzLDZzMjMtMS4yNTQsMjMtNnYtMy4wNDMKCUM1Myw0Ny41MTksNTEuMDg5LDQ0LjQyNyw0OC4wMTQsNDIuODg5eiIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
    camel.apache.org/provider: "Apache Software Foundation"
    camel.apache.org/workflow.group: "Users"
    organizer.apache.com/process-model.services:
     - PowerFlow
     - CA
  labels:
    camel.apache.org/workflow.type: "source"
    organizer.apache.com/workflow.type: "workflow or process-model" # this will replace the isProcessModel boolean
    organizer.apache.com/gridos.group: "scada,mta... etc" # this will replace the current workflow group field
    organizer.apache.com/gridos.owner: "MISO... etc" # this will replace the current workflow owner field
    # the following labels will only be relevant to process models
    organizer.apache.com/process-model.type: "realtime or study"
spec:
  definition:
    title: ${workflowId}
    description: "Produces periodic events about random users!"
    type: Header
    properties:
      foo:
        title: Foo Header
        description: A required header
        type: Header
      fob:
        title: Fob Header
        description: A header that is not required
        type: Header
  types:
    out:
      default: text
      types:
        text:
          mediaType: application/json
          schema: for json outputs
  dependencies:
    - "camel:timer"
    - "camel:http"
    - "camel:workflow"
  routes:
    from:
      id: ${getCamelRandomId('from')}
      uri: direct:foo
      parameters:
        period: "{{period}}"
        timerName: user
      steps:
      - convert-body-to:
          uri: https
          parameters:
            httpUri: random-data-api.com/api/v2/users
      - to: "workflow:sink"
      - filter:
            simple: "${getCamelRandomId('from')} != null"
      - log: "${getCamelRandomId('from')}"
      - to: "direct.bap"
  `;
};
