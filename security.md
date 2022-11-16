Security considerations
---

### OSWAP DOcker top 10

## D01 - Secure User Mapping
All containers are run with non-root users. Instead the containers run with the least privileged user group as possible for the containers.

## D02 - Patch Management Strategy
Once security bugs have been identified it is up to the product owner to prioritise them. The product owner also decides on security updates being regular patches or emergency patches.

## D03 - Network Segmentation and Firewalling
The network segmentation is managed by the Kubernetes Container Orchestration Engine. In the default configuration we ensure that only the frontend, the gateway, open web concept and elastic management dashboard (kibana) are exposed. All other traffic remains within the kubernetes cluster. The default network layout is drawn below (todo). It is left up to the discretion of the installing party to only expose other services if needed, or to unexpose services that do not need to be exposed for their use that will be made of the containers.

## D04 - Secure Defaults and Hardening
All containers are build upon the Alpine operating system, ensuring that the containers contain a minimum of dependencies. Also, the dependencies of the containers are kept to a minimum. Only dependencies that are needed for proper operation of the containers are installed.

All containers also run with the minimum capabilities for the container used, nor can de users in the container request new security privileges.

## D05 - Maintain Security Contexts
Although the containers for production and other environments have the same default security hardening, we do not mix containers that are used for production with other containers on the same host (note: at the moment of writing we do mix accept and development on the same host, but these will be separated).

## D06 - Protect Secrets
We do not store production passwords, private keys, certificates or other credentials unencrypted in our repositories or on other locations. All passwords that are mentioned in the repositories are testing defaults that really should not be used in production.

All secrets that are stored in the databases are only reachable after logging in. (todo: iets met secrets die nog zwaarder beveiligd moeten worden)

## D07 - Resource Protection
All containers have default resource limits in their deployment files, however, these can be overridden by the installing party to allow for higher, or lower, resource limits.

## D08 - Container Image Integrity and Origin
All images are stored in the GitHub Container Registry managed by the Klantinteractie Servicesysteem organization. These images cannot be overwritten by others than github users that have permission to write images to this organisation. This also means that usually only code changes, dependency updates and other changes can only end up in published images when checked by a organisation administrator.

## D09 - Follow Immutable Paradigm
The containers run in read-only filesystems as much as possible. However, nginx images are notoriously hard to run in read only filesystems. Therefore we have the PHP images of the gateway hardened with a read only file system, but for nginx images (frontend, dmz) we are still working on a solution to be able to use read-only filesystems.

## D10 - Logging
All requests to the common gateway are logged by the common gateway in UTC. All logs are read-only and contain information on the requesting party. On top of that, we strongly advise to install loki on the kubernetes clusters of the installing party, where all these logs can also be stored. Loki also stores the Kubernetes logs of the containers.

Additional logging is left up to the installing party and the hosting party on which they install their KISS application.

##Vulnerability Scanning
The repository is regularly scanned by [Snyk](https://snyk.io). This scan produces a list of vulnerabilities in the repository it scans. Usually we will aim at fixing a vulnerability as soon as possible, however, there are some exceptions for false-positives in the results of the scan. Also GitHub vulnerability scanning is enabled which also gives a security report periodically. For now this document only reports snyk vulnerabilities.

### Code exceptions
There is a small number of vulnerabilities mentioned by Snyk that will not be fixed due to them being false-positives.

#### MD5 Hashes
#####[Snyk CWE-916](https://app.snyk.io/org/klantinteractie-servicesysteem/project/83032e8f-9c92-42f1-a159-b88a7cb8ff0c#issue-dab84a22-7df7-44d4-9301-abe13de76499)
In the Snyk results it is mentioned that in some places in this gateway a MD5 hash is used, and that a stronger hashing algorithm should be used for passwords.
However, as the MD5 hashes are not used as credentials, but as cache identifiers, the use of MD5 does not have security implications. Therefore the priority to replace these MD5 hashes with a different algorithm is considered low.

#### Cross-site Scripting 
#####[Snyk CWE-79](https://app.snyk.io/org/klantinteractie-servicesysteem/project/83032e8f-9c92-42f1-a159-b88a7cb8ff0c#issue-2ee236ac-1097-4f52-9700-1060c5387f47)
There are two locations identified by Snyk where it detects the possibility of cross-site scripting due to insufficient sanitising of the data passed from input to output. This issue has been investigated thoroughly, and we decided there is no possibility of input leaking into the output of the response, therefore we decided this was a false positive that will not be fixed.

### Helm exceptions
There are some vulnerabilities mentioned by Snyk in our helm files that are also mentioned by the OWASP docker top 10.
Because of a number of reasons not all of these vulnerabilities are solved, and documented here as to why we cannot or will not solve them.

#### Resource Limits
#####[SNYK-CC-K8S-5](https://app.snyk.io/org/klantinteractie-servicesysteem/project/5bfcf19d-6432-4f02-9795-ea22b2b9c5c2#issue-SNYK-CC-K8S-5_[DocId: 0].input.spec.template.spec.containers[kiss-frontend].resources.limits.cpu)
#####[SNYK-CC-K8S-4](https://app.snyk.io/org/klantinteractie-servicesysteem/project/5bfcf19d-6432-4f02-9795-ea22b2b9c5c2#issue-SNYK-CC-K8S-4_[DocId: 0].input.spec.template.spec.containers[kiss-frontend].resources.limits.memory)
Both the OWASP Docker top 10 and Snyk expect Helm files to mention resource limits on CPU and memory. However, while Snyk and OWASP recommend this, Helm itself strongly discourages the use of forced resource limits because you cannot predict the kind of cluster the component is going to run on, 
instead, we present in the values.yaml suggested values based on average Kubernetes clusters, but they can be more relaxed on heavy duty clusters, or more stringent on clusters with less power.


##OWASP Docker top 10

#### Read-only Filesystems
Although we managed to get the PHP containers running on read-only filesystems, the containers used as DMZ with NGINX cannot run on read-only filesystems like the PHP containers due to the limitations of NGINX.
