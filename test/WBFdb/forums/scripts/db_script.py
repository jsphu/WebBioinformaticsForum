from forums.user.models import WBFUserModel
from forums.amplify.models import AmplifyModel
from forums.announce.models import AnnounceModel
from forums.report.models import ReportModel
from forums.like.models import LikeModel
from forums.opine.models import OpineModel
from pipelines.pipeline.models import PipelineModel
from pipelines.process.models import ProcessModel
from pipelines.parameter.models import ParameterModel

def run():
    user = WBFUserModel.objects.last()
    pipeline, created = PipelineModel.objects.update_or_create(
        owner=user,
        flow_data=""
    )
    print(pipeline.clean())
    print(pipeline.flow_data, created)
